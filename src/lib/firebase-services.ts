
import { db, storage } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Project } from './placeholder-data';

// --------- Projects API ---------

// Function to fetch all projects from Firestore
export const getProjects = async (): Promise<Project[]> => {
  const projectsCol = collection(db, 'projects');
  const projectSnapshot = await getDocs(projectsCol);
  const projectList = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  return projectList;
};

// Function to fetch a single project by its ID
export const getProjectById = async (id: string): Promise<Project | null> => {
  const projectDocRef = doc(db, 'projects', id);
  const projectDoc = await getDoc(projectDocRef);
  if (projectDoc.exists()) {
    return { id: projectDoc.id, ...projectDoc.data() } as Project;
  } else {
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


// --------- Storage API ---------

// Function to upload a file to Firebase Storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
