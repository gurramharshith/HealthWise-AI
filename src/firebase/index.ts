
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from './config';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    return getSdks(getApp());
  }

  // In a production Firebase App Hosting environment, this variable will be automatically provided.
  // We check for its presence to decide which initialization method to use.
  const isAppHosting = process.env.NEXT_PUBLIC_FIREBASE_APP_HOSTING_URL;

  let firebaseApp;
  if (isAppHosting) {
    // This will succeed in a Firebase App Hosting environment.
    firebaseApp = initializeApp({});
  } else {
    // This is the path for local development or other environments.
    // It uses the explicit configuration from firebase/config.ts.
    if (!firebaseConfig.apiKey) {
      throw new Error('Firebase API key is not set. Please check your firebaseConfig object in src/firebase/config.ts');
    }
    firebaseApp = initializeApp(firebaseConfig);
  }

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
