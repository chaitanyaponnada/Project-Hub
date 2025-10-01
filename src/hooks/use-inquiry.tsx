
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getInquiries } from '@/lib/firebase-services';
import { useAuth } from './use-auth';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string; 
}

interface InquiryContextType {
  inquiries: Inquiry[];
  addInquiry: (inquiry: Inquiry) => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider = ({ children }: { children: ReactNode }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInquiries = async () => {
      if (user) {
        // In a real app, you'd probably filter inquiries by the current user
        // For now, we'll fetch all as a demonstration for the admin panel
        const fetchedInquiries = await getInquiries();
        const userInquiries = fetchedInquiries.filter(inq => inq.email === user.email);
        setInquiries(userInquiries);
      }
    };
    fetchInquiries();
  }, [user]);


  const addInquiry = (inquiry: Inquiry) => {
    setInquiries(prevInquiries => [...prevInquiries, inquiry]);
  };

  return (
    <InquiryContext.Provider value={{ inquiries, addInquiry }}>
      {children}
    </InquiryContext.Provider>
  );
};

export const useInquiry = () => {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
};
