
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { isAdmin, addUserToFirestore } from '@/lib/firebase-services';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // First, handle the redirect result from Google Sign-In
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          // User signed in via redirect.
          toast({ title: "Signed in with Google successfully!" });
          // Ensure user is in Firestore. onAuthStateChanged will handle the rest.
          await addUserToFirestore(result.user);
        }
      })
      .catch((error) => {
        // Avoid showing an error on normal page loads where there is no redirect.
        if (error.code !== 'auth/no-redirect-operation') {
          console.error("Google sign-in redirect error:", error);
          toast({
            title: "Google Sign-in Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      })
      .finally(() => {
         // Now, set up the onAuthStateChanged listener to handle all session states.
         // This runs after the redirect has been processed.
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setLoading(true);
          if (currentUser) {
            setUser(currentUser);
            const adminStatus = await isAdmin(currentUser.uid);
            setIsUserAdmin(adminStatus);
          } else {
            setUser(null);
            setIsUserAdmin(false);
          }
          setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      });
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: isUserAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
