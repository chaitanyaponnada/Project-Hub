
"use client";

import type { Project } from '@/lib/placeholder-data';
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import { doc, getDoc, setDoc, onSnapshot, collection, writeBatch, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { createPaymentRequest } from '@/lib/firebase-services';

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
  checkout: () => Promise<void>;
  isCheckingOut: boolean;
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
      if (!user) return;
      
      const batch = writeBatch(db);

      // 1. Add to user's "purchases" collection
      const purchasesDocRef = doc(db, 'purchases', user.uid);
      const docSnap = await getDoc(purchasesDocRef);
      const existingItems = docSnap.exists() ? docSnap.data().items : [];
      const newItems = [...existingItems, ...items.map(({...item}) => item)];
      batch.set(purchasesDocRef, { items: newItems }, { merge: true });

      // 2. Add each item to the global "sales" collection for analytics
      const salesColRef = collection(db, 'sales');
      items.forEach(item => {
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
      
      // For now, we'll manually clear the cart and redirect.
      // In a real scenario, you'd do this after payment confirmation.
      clearCart();
      router.push('/checkout?status=success');
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

  const buyNow = async (project: Project) => {
    if (!user) {
      router.push('/login?redirect=/projects/' + project.id);
      return;
    }
    await updateFirestoreCart([{ ...project, quantity: 1 }]);
    checkout();
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

  const checkout = async () => {
    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }

    if(cartItems.length === 0) {
      toast({title: "Your cart is empty.", variant: "destructive"});
      return;
    }

    setIsCheckingOut(true);

    try {
      //
      // In a real app, you would get this token from the Google Pay button on your frontend.
      //
      const placeholderPaymentToken = 'placeholder-google-pay-token';
      
      await createPaymentRequest(totalPrice, 'INR', placeholderPaymentToken);

      // The extension now handles the payment. You need to listen to the
      // created document in Firestore to get the response from Square.
      // For this example, we'll simulate a successful purchase after a short delay.
      
      toast({ title: "Processing Payment...", description: "Please wait while we process your transaction." });
      
      // --- SIMULATION ---
      // In a real app, you'd replace this timeout with a Firestore listener
      // that waits for the payment extension to write the result.
      setTimeout(() => {
          addPurchasedItems(cartItems);
          setIsCheckingOut(false);
      }, 3000);
      // --- END SIMULATION ---

    } catch (error) {
      console.error("Error creating payment request:", error);
      toast({ title: "Error", description: "Could not initiate checkout.", variant: "destructive" });
      setIsCheckingOut(false);
    }
  };

  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

  const checkoutWithStripe = checkout;

  return (
    <CartContext.Provider value={{ cartItems, purchasedItems, addToCart, buyNow, removeFromCart, clearCart, cartCount, totalPrice, addPurchasedItems, checkout, isCheckingOut }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  // Remapping checkout to avoid breaking existing components that call checkoutWithStripe
  return {...context, checkoutWithStripe: context.checkout };
};
