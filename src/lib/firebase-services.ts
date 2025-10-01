
import { db, auth, storage } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, serverTimestamp, Timestamp, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { User } from 'firebase/auth';
import type { Project } from './placeholder-data';


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
 * @param projectData The complete project data, including URLs.
 */
export const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const projectRef = doc(collection(db, 'projects'));
    await setDoc(projectRef, {
        ...projectData,
        id: projectRef.id,
        createdAt: serverTimestamp()
    });
};

/**
* Updates an existing project in Firestore.
* @param projectId The ID of the project to update.
* @param projectData The new data for the project.
*/
export const updateProject = async (
    projectId: string,
    projectData: Partial<Omit<Project, 'id' | 'createdAt'>>
) => {
    const projectRef = doc(db, 'projects', projectId);
    const updateData: any = { ...projectData, lastUpdatedAt: serverTimestamp() };
    await updateDoc(projectRef, updateData);
};


/**
 * Deletes a project from Firestore. Note: This version does not delete files from storage
 * as we are now using external URLs. You may need to manage those files manually.
 * @param projectId The ID of the project to delete.
 */
export const deleteProject = async (projectId: string) => {
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
    const inquiriesCol = collection(db, 'inquiries');
    const q = query(inquiriesCol, where("userId", "==", userId), orderBy("receivedAt", "desc"));
    const inquirySnapshot = await getDocs(q);
    return inquirySnapshot.docs.map(doc => doc.data());
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
 * Creates a checkout session document in Firestore for the Stripe extension to process.
 * @param uid The user's ID.
 * @param cartItems The items in the user's cart.
 */
export const createStripeCheckoutSession = async (uid: string, cartItems: any[]) => {
  const checkoutSessionCollection = collection(db, 'customers', uid, 'checkout_sessions');

  const line_items = cartItems.map(item => ({
      price_data: {
          currency: 'inr',
          product_data: {
              name: item.title,
              images: [item.imageUrls[0]],
          },
          unit_amount: item.price * 100, // Stripe expects price in cents
      },
      quantity: 1,
  }));

  const sessionDocRef = await addDoc(checkoutSessionCollection, {
    mode: 'payment',
    success_url: `${window.location.origin}/checkout?status=success`,
    cancel_url: `${window.location.origin}/checkout?status=cancelled`,
    line_items: line_items,
    metadata: {
        userId: uid,
        cartItemIds: JSON.stringify(cartItems.map(item => item.id)),
    }
  });

  return sessionDocRef;
};
