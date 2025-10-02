
"use client";

import type { Project } from '@/lib/placeholder-data';
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc, onSnapshot, collection, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface CartItem extends Project {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  purchasedItems: CartItem[];
  addToCart: (project: Project) => void;
  buyNow: (project: Project) => void;
  removeFromCart: (projectId: string) => void;
  clearCart: () => void;
  addPurchasedItems: (items: CartItem[]) => void;
  handlePayUCheckout: () => void;
  isCheckingOut: boolean;
  setIsCheckingOut: (isCheckingOut: boolean) => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

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
      if (!user || items.length === 0) return;
      
      setIsCheckingOut(true);
      const batch = writeBatch(db);

      const purchasesDocRef = doc(db, 'purchases', user.uid);
      const docSnap = await getDoc(purchasesDocRef);
      const existingItems = docSnap.exists() ? docSnap.data().items : [];
      
      const itemsToAdd = items.filter(item => !existingItems.some((p: Project) => p.id === item.id));

      if (itemsToAdd.length > 0) {
        const newItems = [...existingItems, ...itemsToAdd.map(({...item}) => item)];
        batch.set(purchasesDocRef, { items: newItems }, { merge: true });

        const salesColRef = collection(db, 'sales');
        itemsToAdd.forEach(item => {
            const saleDocRef = doc(salesColRef);
            batch.set(saleDocRef, {
                id: saleDocRef.id,
                projectId: item.id,
                projectTitle: item.title,
                price: item.price,
                userId: user.uid,
                userName: user.displayName,
                userEmail: user.email,
                userPhotoURL: user.photoURL,
                purchasedAt: serverTimestamp()
            });
        });
        
        await batch.commit();
        clearCart();
      }
      setIsCheckingOut(false);
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

  const buyNow = async (project: Project) => {
    if (!user) {
      router.push('/login?redirect=/projects/' + project.id);
      return;
    }
    
    const existingItem = cartItems.find(item => item.id === project.id);
    if (!existingItem) {
        const newCartItems = [...cartItems, { ...project, quantity: 1 }];
        await updateFirestoreCart(newCartItems);
    }
    
    router.push('/cart');
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

  const handlePayUCheckout = async () => {
      if (!user) {
        toast({ title: "Please log in", description: "You need to be logged in to check out.", variant: "destructive" });
        return;
      }
      if (cartCount === 0) {
        toast({ title: "Your cart is empty", description: "Add some projects to your cart first.", variant: "destructive" });
        return;
      }

      setIsCheckingOut(true);

      const txnid = "txn" + Date.now();
      const productinfo = cartItems.map(item => item.title).join(', ');
      
      try {
        const res = await fetch("/api/payu/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            txnid,
            amount: totalPrice.toFixed(2),
            firstname: user.displayName || 'Customer',
            email: user.email,
            phone: user.phoneNumber || '9999999999', // PayU requires a phone number
            productinfo,
          }),
        });

        if (!res.ok) {
            throw new Error("Failed to initiate payment");
        }

        const data = await res.json();
        
        // This function will programmatically create and submit the form to PayU
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://test.payu.in/_payment"; // Test URL

        for (let key in data) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        
        // Add purchased items after successful redirection
        await addPurchasedItems(cartItems);

      } catch (error) {
        console.error("PayU checkout error:", error);
        toast({ title: "Checkout Error", description: "Could not connect to the payment gateway. Please try again.", variant: "destructive" });
        setIsCheckingOut(false);
      }
  };


  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, purchasedItems, addToCart, buyNow, removeFromCart, clearCart, cartCount, totalPrice, addPurchasedItems, handlePayUCheckout, isCheckingOut, setIsCheckingOut }}>
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
