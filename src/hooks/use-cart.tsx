
"use client";

import type { Project } from '@/lib/placeholder-data';
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useToast } from './use-toast';
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
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const addToCart = (project: Project) => {
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

  const buyNow = (project: Project) => {
    setCartItems(prevItems => {
        // First, check if the item is already in the cart. If so, just proceed.
        const existingItem = prevItems.find(item => item.id === project.id);
        if (prevItems.length === 1 && existingItem) {
            return prevItems;
        }
        // Otherwise, clear the cart and add only this item.
        return [{...project, quantity: 1}];
    });
    router.push('/checkout');
  };

  const removeFromCart = (projectId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== projectId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addPurchasedItems = (items: CartItem[]) => {
    setPurchasedItems(prevPurchased => {
      const newItems = items.filter(item => !prevPurchased.some(p => p.id === item.id));
      return [...prevPurchased, ...newItems];
    });
  };
  
  const cartCount = cartItems.length;

  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.price, 0), [cartItems]);

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
