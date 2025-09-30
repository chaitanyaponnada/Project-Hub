"use client";

import type { Project } from '@/lib/placeholder-data';
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useToast } from './use-toast';

interface CartItem extends Project {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (project: Project) => void;
  removeFromCart: (projectId: string) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

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

  const removeFromCart = (projectId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== projectId));
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  const cartCount = cartItems.length;

  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.price, 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount, totalPrice }}>
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
