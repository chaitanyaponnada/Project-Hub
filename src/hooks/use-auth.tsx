
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
    // Primary observer for auth state changes (login, logout)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if(user) {
        const adminStatus = await isAdmin(user.uid);
        setIsUserAdmin(adminStatus);
      } else {
        setIsUserAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // This effect specifically handles the result from a Google sign-in redirect.
    // It runs once when the component mounts.
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // A user has just signed in via redirect.
          // The onAuthStateChanged listener above will handle setting the user state.
          // We just need to ensure their data is in Firestore and give feedback.
          await addUserToFirestore(result.user);
          toast({ title: "Signed in with Google successfully!" });
          
          // Clean up the URL to remove any Firebase redirect parameters.
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error: any) {
        // This error occurs on normal page loads where there's no redirect, so we can safely ignore it.
        if (error.code !== 'auth/no-redirect-operation') {
          console.error("Google sign-in redirect error:", error);
          toast({
            title: "Google Sign-in Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };
    
    handleRedirectResult();
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: isUserAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
