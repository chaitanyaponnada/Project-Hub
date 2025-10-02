
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/lib/error-emitter';
import { type FirestorePermissionError } from '@/lib/errors';

// This is a client-side component that listens for permission errors
// and throws them as an uncaught exception. This is what allows the
// Next.js development error overlay to display the rich error.
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // In a production environment, you would log this to a service
      // like Sentry, but for development, we throw it to get the overlay.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        console.error(error); // Fallback for production
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.removeListener('permission-error', handleError);
    };
  }, []);

  return null; // This component doesn't render anything
}
