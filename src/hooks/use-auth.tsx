
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { addUserToUsersCollection } from '@/lib/firebase-services';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // First, handle the redirect result from Google Sign-In
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          // User signed in via redirect.
          toast({ title: "Signed in with Google successfully!" });
          // Ensure user is in Firestore. onAuthStateChanged will handle the rest.
          await addUserToUsersCollection(result.user);
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
          } else {
            setUser(null);
          }
          setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      });
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
