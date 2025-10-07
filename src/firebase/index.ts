
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

  // In a production Firebase App Hosting environment, these NEXT_PUBLIC_FIREBASE_* variables
  // will be automatically provided. In a local environment, they are loaded from .env.
  // We check for a truthy value to decide which initialization method to use.
  const useAppHosting = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'undefined';

  let firebaseApp;
  if (useAppHosting) {
    try {
      // This will succeed in a Firebase App Hosting environment.
      firebaseApp = initializeApp({});
    } catch (e) {
      // This might happen in local dev if env vars are set but something is misconfigured.
      // Fallback to the explicit config.
      console.warn('Automatic Firebase initialization failed despite env vars being present. Falling back to firebaseConfig.', e);
      if (!firebaseConfig.apiKey) {
        throw new Error('Firebase API key is not set in firebaseConfig. Please check your configuration.');
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    // This is the path for local development when env vars are not set from the hosting provider.
    if (!firebaseConfig.apiKey) {
      throw new Error('Firebase API key is not set. Please check your firebaseConfig object.');
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
