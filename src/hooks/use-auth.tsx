
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
  // State to prevent multiple processing of the same redirect
  const [isRedirectProcessing, setIsRedirectProcessing] = useState(true);

  useEffect(() => {
    // This runs once on app load to handle the redirect from Google Sign-In
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          await addUserToFirestore(result.user);
          toast({ title: "Signed in with Google successfully!" });
        }
      })
      .catch((error) => {
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
        setIsRedirectProcessing(false);
      });
      
    // This is the primary listener for auth state changes (login, logout)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const adminStatus = await isAdmin(currentUser.uid);
        setIsUserAdmin(adminStatus);
      } else {
        setIsUserAdmin(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);

  // The loading state should consider both the redirect processing and the auth state listener
  const finalLoading = loading || isRedirectProcessing;

  return (
    <AuthContext.Provider value={{ user, loading: finalLoading, isAdmin: isUserAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
