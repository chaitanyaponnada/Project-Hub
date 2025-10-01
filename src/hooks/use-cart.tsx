
"use client";

import type { Project } from '@/lib/placeholder-data';
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CartItem extends Project {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  purchasedItems: CartItem[];
  addToCart: (project: Project) => void;
  buyNow: (project: Project, redirectUrl: string) => void;
  removeFromCart: (projectId: string) => void;
  clearCart: () => void;
  addPurchasedItems: (items: CartItem[]) => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch cart and purchased items from Firestore on user change
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setPurchasedItems([]);
      return;
    }

    const cartDocRef = doc(db, 'carts', user.uid);
    const unsubscribeCart = onSnapshot(cartDocRef, (doc) => {
      if (doc.exists()) {
        setCartItems(doc.data().items || []);
      } else {
        setCartItems([]);
      }
    });

    const purchasesDocRef = doc(db, 'purchases', user.uid);
     const unsubscribePurchases = onSnapshot(purchasesDocRef, (doc) => {
      if (doc.exists()) {
        setPurchasedItems(doc.data().items || []);
      } else {
        setPurchasedItems([]);
      }
    });

    return () => {
        unsubscribeCart();
        unsubscribePurchases();
    }
  }, [user]);

  const updateFirestoreCart = async (newCartItems: CartItem[]) => {
    if (!user) return;
    const cartDocRef = doc(db, 'carts', user.uid);
    await setDoc(cartDocRef, { items: newCartItems }, { merge: true });
  };
  
  const addPurchasedItems = async (items: CartItem[]) => {
      if (!user) return;
      const purchasesDocRef = doc(db, 'purchases', user.uid);
      const docSnap = await getDoc(purchasesDocRef);
      const existingItems = docSnap.exists() ? docSnap.data().items : [];
      const newItems = [...existingItems, ...items.map(({...item}) => item)];
      await setDoc(purchasesDocRef, { items: newItems }, { merge: true });
  };

  const addToCart = (project: Project) => {
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

  const buyNow = (project: Project, redirectUrl: string) => {
    // This is a simplified "buy now" - it just adds to cart and redirects.
    // A real implementation would go straight to a checkout session.
    const existingItem = cartItems.find(item => item.id === project.id);
    if (!existingItem) {
      const newCartItems = [...cartItems, { ...project, quantity: 1 }];
      setCartItems(newCartItems);
      updateFirestoreCart(newCartItems);
    }
    // In a real app, you would create a checkout session and redirect
    // for now, we just go to the checkout page.
    window.location.href = redirectUrl;
  };

  const removeFromCart = (projectId: string) => {
    const newCartItems = cartItems.filter(item => item.id !== projectId);
    setCartItems(newCartItems);
    updateFirestoreCart(newCartItems);
    toast({ title: 'Item Removed', description: `Item has been removed from your cart.` });
  };

  const clearCart = () => {
    setCartItems([]);
    updateFirestoreCart([]);
    toast({ title: 'Cart Cleared' });
  };

  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, purchasedItems, addToCart, buyNow, removeFromCart, clearCart, cartCount, totalPrice, addPurchasedItems }}>
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
