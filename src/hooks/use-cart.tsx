
"use client";

import type { Project } from '@/lib/placeholder-data';
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useToast } from './use-toast';
import { useRouter, usePathname } from 'next/navigation';

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

// A state to track if the last action was "Buy Now"
let isBuyNowFlow = false;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If the user navigates away from checkout during a "Buy Now" flow, reset the flag.
    if (isBuyNowFlow && pathname !== '/checkout') {
      isBuyNowFlow = false;
      // Optional: You could also clear the cart here if you want to be strict.
      // clearCart(); 
    }
  }, [pathname]);

  const addToCart = (project: Project) => {
    isBuyNowFlow = false; // Any "Add to Cart" action cancels the Buy Now flow
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === project.id);
      if (existingItem) {
        toast({
          title: "Already in Cart",
          description: `"${project.title}" is already in your shopping cart.`,
        });
        return prevItems;
      }
      toast({
        title: "Added to Cart",
        description: `"${project.title}" has been added to your cart.`,
        variant: "default",
      });
      return [...prevItems, { ...project, quantity: 1 }];
    });
  };

  const buyNow = (project: Project, redirectUrl: string) => {
    isBuyNowFlow = true; // Set the flag for the "Buy Now" flow
    // Replace the entire cart with just the "Buy Now" item
    setCartItems([{...project, quantity: 1}]);
    router.push(redirectUrl);
  };

  const removeFromCart = (projectId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== projectId));
    isBuyNowFlow = false;
  };

  const clearCart = () => {
    setCartItems([]);
    isBuyNowFlow = false;
  };

  const addPurchasedItems = (items: CartItem[]) => {
    setPurchasedItems(prevPurchased => {
      const newItems = items.filter(item => !prevPurchased.some(p => p.id === item.id));
      return [...prevPurchased, ...newItems];
    });
  };
  
  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);

  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, purchasedItems, addToCart, buyNow, removeFromCart, clearCart, addPurchasedItems, cartCount, totalPrice }}>
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
