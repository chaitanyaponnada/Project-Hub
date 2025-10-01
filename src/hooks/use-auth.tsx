
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
    // Handle redirect result from Google sign-in
    const handleRedirect = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                await addUserToFirestore(result.user);
                setUser(result.user);
                toast({ title: "Signed in with Google successfully!" });
                // Redirect to home page after successful sign-in
                window.history.replaceState({}, document.title, "/");
            }
        } catch (error: any) {
            console.error("Google sign-in redirect error:", error);
            toast({
                title: "Google Sign-in Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    };
    
    handleRedirect();

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
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: isUserAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

    