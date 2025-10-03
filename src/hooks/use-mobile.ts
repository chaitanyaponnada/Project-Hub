"use client";

import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // A function to check the screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Run the check on initial component mount
    checkScreenSize();

    // Add event listener to check on window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return isMobile;
}
