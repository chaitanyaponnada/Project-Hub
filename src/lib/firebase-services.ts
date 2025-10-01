
import { db, auth, storage } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { User } from 'firebase/auth';
import type { Project } from './placeholder-data';


/**
 * Checks if a user is an admin.
 * @param uid The user's ID.
 */
export const isAdmin = async (uid: string): Promise<boolean> => {
    if (!uid) return false;
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    return adminDoc.exists();
};

/**
 * Promotes a user to an admin by adding their UID to the 'admins' collection.
 * @param uid The user's ID to be promoted.
 */
export const promoteToAdmin = async (uid: string) => {
    if (!uid) return;
    const adminRef = doc(db, 'admins', uid);
    await setDoc(adminRef, { admin: true, promotedAt: serverTimestamp() });
};


/**
 * Adds or updates a user in the `users` collection in Firestore.
 * If the user doesn't exist, it creates a new document.
 * If the user exists, it updates their last sign-in time.
 * @param user The user object from Firebase Auth.
 */
export const addUserToFirestore = async (user: User) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        // Create user record
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastSignInTime: serverTimestamp(),
        });
    } else {
        // Update last sign-in time
         await updateDoc(userRef, {
            lastSignInTime: serverTimestamp(),
        });
    }
};

/**
 * Uploads files to Firebase Storage and returns their download URLs.
 * @param path The storage path (e.g., 'project-images').
 * @param files The files to upload.
 */
const uploadFiles = async (path: string, files: FileList): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of Array.from(files)) {
        const fileRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        urls.push(url);
    }
    return urls;
};

/**
 * Adds a new project to Firestore, including uploading images and project file.
 * @param projectData The core project data.
 * @param imageFiles The project's images.
 * @param projectFile The project's downloadable zip file.
 */
export const addProject = async (projectData: Omit<Project, 'id' | 'imageUrls' | 'downloadUrl' | 'createdAt'>, imageFiles: FileList, projectFile: File) => {
    // 1. Upload Images
    const imageUrls = await uploadFiles('project-images', imageFiles);
    
    // 2. Upload Project File
    const projectFileRef = ref(storage, `project-files/${Date.now()}-${projectFile.name}`);
    await uploadBytes(projectFileRef, projectFile);
    const downloadUrl = await getDownloadURL(projectFileRef);

    // 3. Add Project to Firestore
    const projectRef = doc(collection(db, 'projects'));
    await setDoc(projectRef, {
        ...projectData,
        id: projectRef.id,
        imageUrls,
        downloadUrl,
        createdAt: serverTimestamp()
    });
};

/**
 * Updates an existing project in Firestore.
 * @param projectId The ID of the project to update.
 * @param projectData The new data for the project.
 * @param newImageFiles Optional new images to upload.
 * @param newProjectFile Optional new project file to upload.
 */
export const updateProject = async (
    projectId: string,
    projectData: Partial<Omit<Project, 'id' | 'createdAt'>>,
    newImageFiles?: FileList | null,
    newProjectFile?: File
) => {
    const projectRef = doc(db, 'projects', projectId);
    const updateData: any = { ...projectData, lastUpdatedAt: serverTimestamp() };

    if (newImageFiles && newImageFiles.length > 0) {
        // In a real scenario, you might want to delete old images first.
        // For simplicity, we'll just add new ones. A more robust solution
        // would manage image references carefully.
        const newImageUrls = await uploadFiles('project-images', newImageFiles);
        const existingDoc = await getDoc(projectRef);
        const existingUrls = existingDoc.data()?.imageUrls || [];
        updateData.imageUrls = [...existingUrls, ...newImageUrls];
    }
    
    if (newProjectFile) {
        // Similar to images, you might want to delete the old file.
        const projectFileRef = ref(storage, `project-files/${Date.now()}-${newProjectFile.name}`);
        await uploadBytes(projectFileRef, newProjectFile);
        updateData.downloadUrl = await getDownloadURL(projectFileRef);
    }
    
    await updateDoc(projectRef, updateData);
};


/**
 * Deletes a project from Firestore and its associated files from Storage.
 * @param projectId The ID of the project to delete.
 * @param imageUrls Array of image URLs to delete from Storage.
 * @param downloadUrl The download URL of the project file to delete.
 */
export const deleteProject = async (projectId: string, imageUrls: string[], downloadUrl: string) => {
    // Delete files from Storage
    const deleteFileFromUrl = async (url: string) => {
        try {
            const fileRef = ref(storage, url);
            await deleteObject(fileRef);
        } catch (error: any) {
            // It's okay if the file doesn't exist (e.g., URL is malformed or file already deleted)
            if (error.code !== 'storage/object-not-found') {
                console.error("Error deleting file from storage:", error);
            }
        }
    };
    
    const imagePromises = imageUrls.map(url => deleteFileFromUrl(url));
    const filePromise = deleteFileFromUrl(downloadUrl);
    
    await Promise.all([...imagePromises, filePromise]);

    // Delete project document from Firestore
    await deleteDoc(doc(db, 'projects', projectId));
};


/**
 * Fetches all projects from Firestore.
 */
export const getProjects = async (): Promise<Project[]> => {
    const projectsCol = collection(db, 'projects');
    const q = query(projectsCol, orderBy("createdAt", "desc"));
    const projectSnapshot = await getDocs(q);
    const projectList = projectSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            ...data,
            id: doc.id,
            // Firestore timestamps need to be converted
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
        } as Project;
    });
    return projectList;
};

/**
 * Fetches a single project by its ID from Firestore.
 * @param id The project ID.
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
    const projectDoc = doc(db, 'projects', id);
    const projectSnapshot = await getDoc(projectDoc);
    if (projectSnapshot.exists()) {
        const data = projectSnapshot.data();
        return { 
            ...data,
            id: projectSnapshot.id,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt
        } as Project;
    } else {
        return null;
    }
};

/**
 * Fetches all users from Firestore.
 */
export const getUsers = async () => {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy("createdAt", "desc"));
    const userSnapshot = await getDocs(q);
    return userSnapshot.docs.map(doc => doc.data());
};

/**
 * Adds a new inquiry to the `inquiries` collection in Firestore.
 * @param inquiryData The inquiry data.
 */
export const addInquiry = async (inquiryData: { name: string, email: string, message: string }) => {
    const inquiryRef = doc(collection(db, 'inquiries'));
    await setDoc(inquiryRef, {
        ...inquiryData,
        receivedAt: serverTimestamp(),
        id: inquiryRef.id
    });
};

/**
 * Fetches all inquiries from Firestore.
 */
export const getInquiries = async () => {
    const inquiriesCol = collection(db, 'inquiries');
    const q = query(inquiriesCol, orderBy("receivedAt", "desc"));
    const inquirySnapshot = await getDocs(q);
    return inquirySnapshot.docs.map(doc => doc.data());
};

/**
 * Deletes an inquiry from Firestore.
 * @param inquiryId The ID of the inquiry to delete.
 */
export const deleteInquiry = async (inquiryId: string) => {
    await deleteDoc(doc(db, 'inquiries', inquiryId));
};
