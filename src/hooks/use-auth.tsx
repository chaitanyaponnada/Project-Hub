
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
    const processRedirectResult = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                // This indicates a user just signed in via Google redirect.
                await addUserToFirestore(result.user);
                toast({ title: "Signed in with Google successfully!" });
                // Clean up the URL.
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (error: any) {
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
    
    // We want to check for a redirect result as soon as the app loads.
    processRedirectResult();

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

    return () => unsubscribe();
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: isUserAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
