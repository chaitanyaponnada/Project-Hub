
import { db, auth, storage } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { User } from 'firebase/auth';
import type { Project } from './placeholder-data';


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
