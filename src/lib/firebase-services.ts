
import { db, storage, auth } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, Timestamp, setDoc, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Project } from './placeholder-data';
import type { Inquiry } from '@/hooks/use-inquiry';
import { User, signInWithEmailAndPassword } from 'firebase/auth';


// --------- Projects API ---------

// Function to fetch all projects from Firestore
export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsCol = collection(db, 'projects');
    const projectSnapshot = await getDocs(projectsCol);
    const projectList = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    return projectList;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// Function to fetch a single project by its ID
export const getProjectById = async (id: string): Promise<Project | null> => {
   try {
    const projectDocRef = doc(db, 'projects', id);
    const projectDoc = await getDoc(projectDocRef);
    if (projectDoc.exists()) {
      return { id: projectDoc.id, ...projectDoc.data() } as Project;
    } else {
      console.warn("No project found with id:", id);
      return null;
    }
  } catch (error) {
    console.error("Error fetching project by id:", error);
    return null;
  }
};

// Function to add a new project
export const addProject = async (projectData: Omit<Project, 'id'>) => {
  const projectsCol = collection(db, 'projects');
  await addDoc(projectsCol, projectData);
};

// Function to update an existing project
export const updateProject = async (id: string, projectData: Partial<Omit<Project, 'id'>>) => {
  const projectDocRef = doc(db, 'projects', id);
  await updateDoc(projectDocRef, projectData);
};

// Function to delete a project
export const deleteProject = async (id: string) => {
  const projectDocRef = doc(db, 'projects', id);
  await deleteDoc(projectDocRef);
};

// --------- Inquiries API ---------
export const addInquiryToFirestore = async (inquiryData: Omit<Inquiry, 'id' | 'receivedAt'>) => {
  const inquiriesCol = collection(db, 'inquiries');
  await addDoc(inquiriesCol, {
    ...inquiryData,
    receivedAt: Timestamp.now(),
  });
};

export const getInquiries = async (): Promise<Inquiry[]> => {
    try {
        const inquiriesCol = collection(db, 'inquiries');
        const q = query(inquiriesCol, orderBy("receivedAt", "desc"));
        const inquirySnapshot = await getDocs(q);
        const inquiryList = inquirySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                receivedAt: (data.receivedAt as Timestamp).toDate().toLocaleDateString(),
            } as Inquiry;
        });
        return inquiryList;
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        return [];
    }
};

// --------- Storage API ---------

// Function to upload a file to Firebase Storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};


// --------- User API ---------
export const addUserToFirestore = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: Timestamp.now(),
        });
    }
};

// -------- Admin Auth API --------
export const verifyAdminCredentials = async (email: string, password: string): Promise<boolean> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
            const adminDocRef = doc(db, 'admins', user.uid);
            const adminDoc = await getDoc(adminDocRef);
            return adminDoc.exists() && adminDoc.data().isAdmin === true;
        }
        return false;
    } catch (error) {
        // This will catch failed sign-in attempts (wrong password, etc.)
        console.error("Admin verification failed", error);
        return false;
    }
};

    