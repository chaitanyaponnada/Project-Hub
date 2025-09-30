
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

interface InquiryContextType {
  inquiries: Inquiry[];
  addInquiry: (inquiry: Inquiry) => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider = ({ children }: { children: ReactNode }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

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
