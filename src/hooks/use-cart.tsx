
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


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  const disabledFunction = () => {
    toast({
        title: "Functionality Disabled",
        description: "The database has been removed from this project.",
        variant: "destructive"
    });
  }

  const value = {
      cartItems: [],
      purchasedItems: [],
      addToCart: (project: Project) => disabledFunction(),
      buyNow: (project: Project, redirectUrl: string) => disabledFunction(),
      removeFromCart: (projectId: string) => disabledFunction(),
      clearCart: () => disabledFunction(),
      addPurchasedItems: (items: CartItem[]) => disabledFunction(),
      cartCount: 0,
      totalPrice: 0
  };

  return (
    <CartContext.Provider value={value}>
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
