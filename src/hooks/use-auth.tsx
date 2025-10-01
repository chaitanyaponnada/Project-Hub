
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
    // This is the primary observer for auth state changes.
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

    // Separate logic to handle the redirect result from Google sign-in.
    const handleRedirect = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                // This means the user has just signed in/up via Google redirect.
                await addUserToFirestore(result.user);
                toast({ title: "Signed in with Google successfully!" });
                
                // Clean up the URL to remove any Firebase redirect parameters.
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (error: any) {
            // Don't show an error if there's no redirect result, it's expected on normal page loads.
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
    
    // We only want to handle the redirect result after the initial auth state is determined.
    if (!loading) {
        handleRedirect();
    }

    return () => unsubscribe();
  // We add `loading` as a dependency to ensure handleRedirect runs after the initial loading is complete.
  }, [toast, loading]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: isUserAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
