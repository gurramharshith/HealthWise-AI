
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore'
import { firebaseConfig } from './config';

// A type guard to check if we are in a browser environment
const isBrowser = () => typeof window !== 'undefined';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase(): { firebaseApp: FirebaseApp, auth: Auth, firestore: Firestore } {
  // If not in a browser, return a dummy object to avoid server-side errors.
  // This prevents the "invalid-api-key" error during server-side rendering.
  if (!isBrowser()) {
    // On the server, we return a structure that matches the expected return type
    // but with null values, as client-side services are not available.
    // The actual initialization will happen on the client.
    return { firebaseApp: null as any, auth: null as any, firestore: null as any };
  }

  if (getApps().length) {
    const app = getApp();
    return getSdks(app);
  }

  // This is the definitive client-side initialization.
  const firebaseApp = initializeApp(firebaseConfig);
  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './auth/use-user-profile';
export * from './errors';
export * from './error-emitter';
