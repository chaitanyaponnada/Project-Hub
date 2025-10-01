
import { db, storage } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Project } from './placeholder-data';
import type { Inquiry } from '@/hooks/use-inquiry';


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
export const addInquiryToFirestore = async (inquiryData: Omit<Inquiry, 'id'>) => {
  const inquiriesCol = collection(db, 'inquiries');
  await addDoc(inquiriesCol, {
    ...inquiryData,
    receivedAt: Timestamp.now(),
  });
};

export const getInquiries = async (): Promise<Inquiry[]> => {
    try {
        const inquiriesCol = collection(db, 'inquiries');
        const inquirySnapshot = await getDocs(inquiriesCol);
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
