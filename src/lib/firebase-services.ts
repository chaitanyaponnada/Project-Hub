import { db, auth, storage } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { User } from 'firebase/auth';
import type { Project } from './placeholder-data';


/**
 * Adds a new user to the `users` collection in Firestore.
 * If the user already exists, it does nothing.
 * @param user The user object from Firebase Auth.
 */
export const addUserToFirestore = async (user: User) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastSignInTime: serverTimestamp(),
        });
    } else {
         await updateDoc(userRef, {
            lastSignInTime: serverTimestamp(),
        });
    }
};

/**
 * Checks if a user is an admin.
 * @param uid The user's ID.
 * @returns True if the user is an admin, false otherwise.
 */
export const isAdmin = async (uid: string): Promise<boolean> => {
    const adminDocRef = doc(db, 'admins', uid);
    const adminDoc = await getDoc(adminDocRef);
    return adminDoc.exists();
};


/**
 * Fetches all projects from Firestore.
 */
export const getProjects = async (): Promise<Project[]> => {
    const projectsCol = collection(db, 'projects');
    const q = query(projectsCol, orderBy("createdAt", "desc"));
    const projectSnapshot = await getDocs(q);
    const projectList = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
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
        return { id: projectSnapshot.id, ...projectSnapshot.data() } as Project;
    } else {
        return null;
    }
};

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 * @param path The path in storage to upload to.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

/**
 * Adds a new project to Firestore.
 * @param projectData The project data to add.
 * @param images The image files to upload.
 * @param projectFile The project zip file to upload.
 */
export const addProject = async (projectData: Omit<Project, 'id' | 'imageUrls' | 'downloadUrl'>, images: File[], projectFile: File): Promise<string> => {
    
    // 1. Create a new project document to get an ID
    const newProjectRef = doc(collection(db, "projects"));
    const projectId = newProjectRef.id;

    // 2. Upload images
    const imageUrls = await Promise.all(
        images.map((image, index) => uploadFile(image, `projects/${projectId}/image_${index}_${image.name}`))
    );

    // 3. Upload project file
    const downloadUrl = await uploadFile(projectFile, `projects/${projectId}/${projectFile.name}`);

    // 4. Create the project document in Firestore
    const newProject: Omit<Project, 'id'> & {createdAt: any} = {
        ...projectData,
        imageUrls,
        downloadUrl,
        createdAt: serverTimestamp()
    };
    await setDoc(newProjectRef, newProject);
    return projectId;
};

/**
 * Updates an existing project in Firestore.
 */
export const updateProject = async (
    projectId: string, 
    projectData: Partial<Project>,
    newImages?: File[],
    newProjectFile?: File
) => {
    const projectRef = doc(db, 'projects', projectId);
    const updateData: any = { ...projectData };

    if (newImages && newImages.length > 0) {
        const newImageUrls = await Promise.all(
            newImages.map((image, index) => uploadFile(image, `projects/${projectId}/image_${Date.now()}_${index}_${image.name}`))
        );
        // Assuming you want to add to existing images
        const existingProject = await getProjectById(projectId);
        updateData.imageUrls = [...(existingProject?.imageUrls || []), ...newImageUrls];
    }
    
    if (newProjectFile) {
        const newDownloadUrl = await uploadFile(newProjectFile, `projects/${projectId}/${newProjectFile.name}`);
        updateData.downloadUrl = newDownloadUrl;
    }

    await updateDoc(projectRef, updateData);
};


/**
 * Deletes a project from Firestore and its associated files from Storage.
 * @param projectId The ID of the project to delete.
 */
export const deleteProject = async (projectId: string) => {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    // Delete images from Storage
    const imageDeletePromises = project.imageUrls.map(url => {
        const imageRef = ref(storage, url);
        return deleteObject(imageRef);
    });

    // Delete project file from Storage
    const fileRef = ref(storage, project.downloadUrl);
    const fileDeletePromise = deleteObject(fileRef);

    await Promise.all([...imageDeletePromises, fileDeletePromise]);

    // Delete project document from Firestore
    await deleteDoc(doc(db, 'projects', projectId));
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
