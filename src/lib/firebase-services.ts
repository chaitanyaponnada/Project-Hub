

import { db, auth, storage } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, serverTimestamp, Timestamp, addDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { User } from 'firebase/auth';
import type { Project, Review, PurchaseRequest } from './placeholder-data';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';


/**
 * Adds a new user to the `users` collection in Firestore.
 * Sets isAdmin to true for the first admin.
 * @param user The user object from Firebase Auth.
 */
export const addUserToUsersCollection = async (user: User) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    let isAdmin = false;

    // Secure, one-time bootstrap for the first admin
    if (user.email === 'chaitanyaponnada657@gmail.com') {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
             const userCountSnapshot = await getDocs(query(collection(db, 'users'), where("isAdmin", "==", true)));
             if(userCountSnapshot.empty) {
                isAdmin = true;
             }
        }
    }
    
    const existingDoc = await getDoc(userRef);
    if (!existingDoc.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            isAdmin: isAdmin,
        }, { merge: true });
    }
};

/**
 * Checks if a user is an admin by looking for their UID in the 'users' collection and checking the isAdmin flag.
 * @param uid The user's ID.
 */
export const isAdmin = async (uid: string): Promise<boolean> => {
    if (!uid) return false;
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() && userDoc.data().isAdmin === true;
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
};


/**
 * Fetches a single user by their ID from Firestore.
 * @param id The user ID.
 */
export const getUserById = async (id: string): Promise<any | null> => {
    const userDoc = doc(db, 'users', id);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
        return userSnapshot.data();
    } else {
        return null;
    }
};

/**
 * Adds a new project to Firestore.
 * This function is non-blocking and uses the error emitter for permission errors.
 * @param projectData The complete project data, including URLs.
 */
export const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const projectRef = doc(collection(db, 'projects'));
    const dataToSave = {
        ...projectData,
        id: projectRef.id,
        createdAt: serverTimestamp()
    };
    
    setDoc(projectRef, dataToSave)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: projectRef.path,
                operation: 'create',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
};

/**
* Updates an existing project in Firestore.
* This function is non-blocking and uses the error emitter for permission errors.
* @param projectId The ID of the project to update.
* @param projectData The new data for the project.
*/
export const updateProject = (
    projectId: string,
    projectData: Partial<Omit<Project, 'id' | 'createdAt'>>
) => {
    const projectRef = doc(db, 'projects', projectId);
    const updateData: any = { ...projectData, lastUpdatedAt: serverTimestamp() };
    
    updateDoc(projectRef, updateData)
      .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: projectRef.path,
                operation: 'update',
                requestResourceData: updateData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
};


/**
 * Deletes a project from Firestore. Note: This version does not delete files from storage
 * as we are now using external URLs. You may need to manage those files manually.
 * @param projectId The ID of the project to delete.
 */
export const deleteProject = async (projectId: string) => {
    const batch = writeBatch(db);
    
    // 1. Delete the project document
    const projectRef = doc(db, 'projects', projectId);
    batch.delete(projectRef);

    // 2. Find and delete related sales records
    const salesQuery = query(collection(db, 'sales'), where('projectId', '==', projectId));
    const salesSnapshot = await getDocs(salesQuery);
    salesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();
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
 * Fetches all users from the 'users' collection in Firestore.
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
 * @param userId Optional user ID if the user is logged in.
 */
export const addInquiry = async (inquiryData: { name: string, email: string, phone: string, message: string }, userId?: string) => {
    const inquiryRef = doc(collection(db, 'inquiries'));
    await setDoc(inquiryRef, {
        ...inquiryData,
        userId: userId || null,
        receivedAt: serverTimestamp(),
        id: inquiryRef.id,
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
 * Fetches inquiries for a specific user.
 * @param userId The user's ID.
 */
export const getInquiriesByUserId = async (userId: string) => {
    if (!userId) return [];
    const inquiriesCol = collection(db, 'inquiries');
    const q = query(inquiriesCol, where("userId", "==", userId), orderBy("receivedAt", "desc"));
    try {
        const inquirySnapshot = await getDocs(q);
        return inquirySnapshot.docs.map(doc => doc.data());
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: inquiriesCol.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        return [];
    }
};

/**
 * Fetches all sales from the 'sales' collection in Firestore.
 */
export const getSales = async () => {
    const salesCol = collection(db, 'sales');
    const q = query(salesCol, orderBy("purchasedAt", "desc"));
    const salesSnapshot = await getDocs(q);
    return salesSnapshot.docs.map(doc => doc.data());
};

/**
 * Fetches all sales for a specific user.
 * @param userId The user's ID.
 */
export const getSalesByUserId = async (userId: string) => {
    if (!userId) return [];
    const salesCol = collection(db, 'sales');
    const q = query(salesCol, where("userId", "==", userId), orderBy("purchasedAt", "desc"));
    const salesSnapshot = await getDocs(q);
    return salesSnapshot.docs.map(doc => doc.data());
};

// Review Management
/**
 * Fetches all reviews from Firestore, ordered by creation date.
 */
export const getReviews = async (): Promise<Review[]> => {
    const reviewsCol = collection(db, 'reviews');
    const q = query(reviewsCol, orderBy("createdAt", "desc"));
    try {
        const reviewSnapshot = await getDocs(q);
        return reviewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({
            path: reviewsCol.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        return []; // Return empty array on permission error
    }
};

/**
 * Fetches a single review by its ID.
 */
export const getReviewById = async (id: string): Promise<Review | null> => {
    const reviewDoc = doc(db, 'reviews', id);
    const reviewSnapshot = await getDoc(reviewDoc);
    if (reviewSnapshot.exists()) {
        return { id: reviewSnapshot.id, ...reviewSnapshot.data() } as Review;
    } else {
        return null;
    }
};

/**
 * Adds a new review to the 'reviews' collection.
 */
export const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const reviewRef = doc(collection(db, 'reviews'));
    const dataToSave = {
        ...reviewData,
        id: reviewRef.id,
        createdAt: serverTimestamp()
    };
    try {
        await setDoc(reviewRef, dataToSave);
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: reviewRef.path,
            operation: 'create',
            requestResourceData: dataToSave,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError; // Re-throw to be caught by the form handler
    }
};

/**
 * Updates an existing review in Firestore.
 */
export const updateReview = async (reviewId: string, reviewData: Partial<Omit<Review, 'id' | 'createdAt'>>) => {
    const reviewRef = doc(db, 'reviews', reviewId);
    const dataToUpdate = {
        ...reviewData,
        lastUpdatedAt: serverTimestamp()
    };
    try {
        await updateDoc(reviewRef, dataToUpdate);
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: reviewRef.path,
            operation: 'update',
            requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
};

/**
 * Deletes a review from Firestore.
 */
export const deleteReview = async (reviewId: string) => {
    const reviewRef = doc(db, 'reviews', reviewId);
    try {
        await deleteDoc(reviewRef);
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: reviewRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
};

/**
 * Adds a new purchase request to Firestore.
 * @param requestData The purchase request data.
 */
export const addPurchaseRequest = async (requestData: Omit<PurchaseRequest, 'id' | 'requestedAt'>) => {
    const requestRef = doc(collection(db, 'purchaseRequests'));
    const dataToSave = {
        ...requestData,
        id: requestRef.id,
        requestedAt: serverTimestamp(),
        status: 'pending' as const,
    };
    try {
        await setDoc(requestRef, dataToSave);
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: requestRef.path,
            operation: 'create',
            requestResourceData: dataToSave,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
};

/**
 * Fetches all purchase requests from Firestore. (Admin only)
 */
export const getPurchaseRequests = async (): Promise<PurchaseRequest[]> => {
    const requestsCol = collection(db, 'purchaseRequests');
    const q = query(requestsCol, orderBy("requestedAt", "desc"));
    const requestSnapshot = await getDocs(q);
    return requestSnapshot.docs.map(doc => doc.data() as PurchaseRequest);
};

/**
 * Updates the status of a purchase request. (Admin only)
 * @param requestId The ID of the request to update.
 * @param status The new status.
 */
export const updatePurchaseRequestStatus = async (requestId: string, status: 'pending' | 'contacted') => {
    const requestRef = doc(db, 'purchaseRequests', requestId);
    try {
        await updateDoc(requestRef, { status });
    } catch (serverError) {
         const permissionError = new FirestorePermissionError({
            path: requestRef.path,
            operation: 'update',
            requestResourceData: { status },
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
};
