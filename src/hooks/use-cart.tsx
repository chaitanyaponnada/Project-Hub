
"use client";

import type { Project, PurchaseRequest } from '@/lib/placeholder-data';
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc, onSnapshot, collection, writeBatch, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';
import { addPurchaseRequest } from '@/lib/firebase-services';

interface CartItem extends Project {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  purchasedProjectIds: string[];
  addToCart: (project: Project) => void;
  removeFromCart: (projectId: string) => void;
  clearCart: () => void;
  handleDummyCheckout: () => void;
  isCheckingOut: boolean;
  setIsCheckingOut: (isCheckingOut: boolean) => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchasedProjectIds, setPurchasedProjectIds] = useState<string[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Fetch cart and purchased items from Firestore on user change
  useEffect(() => {
    if (loading || !user) {
      setCartItems([]);
      setPurchasedProjectIds([]);
      return;
    }

    const cartDocRef = doc(db, 'carts', user.uid);
    const unsubscribeCart = onSnapshot(cartDocRef, (doc) => {
      if (doc.exists()) {
        setCartItems(doc.data().items || []);
      } else {
        setCartItems([]);
      }
    }, (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: cartDocRef.path,
            operation: 'get'
        }));
    });

    const salesColRef = collection(db, 'sales');
    const userSalesQuery = query(salesColRef, where("userId", "==", user.uid));
    
    const unsubscribePurchases = onSnapshot(userSalesQuery, (snapshot) => {
        const userSales = snapshot.docs.map(doc => doc.data());
        setPurchasedProjectIds(userSales.map(sale => sale.projectId));
    }, async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: salesColRef.path,
            operation: 'list'
        });
        errorEmitter.emit('permission-error', permissionError);
    });


    return () => {
        unsubscribeCart();
        unsubscribePurchases();
    }
  }, [user, loading]);

  const updateFirestoreCart = async (newCartItems: CartItem[]) => {
    if (!user) return;
    const cartDocRef = doc(db, 'carts', user.uid);
    setDoc(cartDocRef, { items: newCartItems }, { merge: true })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: cartDocRef.path,
                operation: 'write',
                requestResourceData: { items: newCartItems },
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };
  
  const addItemsToSales = async (items: CartItem[]) => {
      if (!user || items.length === 0) return;
      
      const batch = writeBatch(db);
      const salesColRef = collection(db, 'sales');

      const itemsToAdd = items.filter(item => !purchasedProjectIds.includes(item.id));

      if (itemsToAdd.length > 0) {
        itemsToAdd.forEach(item => {
            const saleDocRef = doc(salesColRef);
            const saleData = {
                id: saleDocRef.id,
                projectId: item.id,
                projectTitle: item.title,
                projectImageUrl: item.imageUrls[0],
                projectDownloadUrl: item.downloadUrl,
                price: item.price,
                userId: user.uid,
                userName: user.displayName,
                userEmail: user.email,
                userPhotoURL: user.photoURL,
                purchasedAt: serverTimestamp()
            };
            batch.set(saleDocRef, saleData);
        });
        
        batch.commit().catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: salesColRef.path,
                operation: 'create',
                requestResourceData: itemsToAdd.map(item => ({ projectId: item.id, price: item.price })) // Example data
            });
            errorEmitter.emit('permission-error', permissionError);
            // Revert optimistic UI changes if needed
            throw serverError; // rethrow to be caught by caller
        });
      }
  };

  const addToCart = (project: Project) => {
    if (!user) {
        router.push('/login?redirect=/projects/' + project.id);
        return;
    }
    const existingItem = cartItems.find(item => item.id === project.id);
    if (existingItem) {
      toast({ title: 'Already in Cart', description: `${project.title} is already in your cart.` });
      return;
    }
    const newCartItems = [...cartItems, { ...project, quantity: 1 }];
    setCartItems(newCartItems);
    updateFirestoreCart(newCartItems);
    toast({ title: 'Added to Cart', description: `${project.title} has been added to your cart.` });
  };

  const removeFromCart = (projectId: string) => {
    const newCartItems = cartItems.filter(item => item.id !== projectId);
    setCartItems(newCartItems);
    updateFirestoreCart(newCartItems);
    toast({ title: 'Item Removed', description: `Item has been removed from your cart.` });
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      updateFirestoreCart([]);
    }
  };

  const handleDummyCheckout = async () => {
      if (!user) {
        toast({ title: "Please log in", description: "You need to be logged in to check out.", variant: "destructive" });
        return;
      }
      if (cartCount === 0) {
        toast({ title: "Your cart is empty", description: "Add some projects to your cart first.", variant: "destructive" });
        return;
      }

      setIsCheckingOut(true);
      toast({ title: 'Processing Purchase', description: 'Please wait...' });

      // Simulate network delay
      setTimeout(async () => {
        try {
          await addItemsToSales(cartItems);
          clearCart();
          router.push('/checkout?status=success');
          toast({ title: 'Purchase Successful!', description: 'Your projects are now in your profile.' });
        } catch (error) {
           toast({ title: 'Purchase Failed', description: 'An error occurred during checkout.', variant: 'destructive' });
        } finally {
            setIsCheckingOut(false);
        }
      }, 2000);
  };


  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, purchasedProjectIds, addToCart, removeFromCart, clearCart, cartCount, totalPrice, handleDummyCheckout, isCheckingOut, setIsCheckingOut }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
