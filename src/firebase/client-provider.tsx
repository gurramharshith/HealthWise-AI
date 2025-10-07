
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // useMemo is critical here to ensure Firebase is only initialized once per render.
  const { firebaseApp, auth, firestore } = useMemo(() => {
    // This will now correctly execute only on the client-side,
    // where window is defined and the full config is available.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  // If the services failed to initialize (e.g., on the server),
  // we can render a loading state or nothing, preventing crashes.
  if (!firebaseApp) {
    return null; // Or return a loading spinner
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
