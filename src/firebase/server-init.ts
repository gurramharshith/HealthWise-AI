
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

// This is a utility function to initialize the Firebase Admin SDK.
// It ensures that the app is initialized only once.
export function initAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Cannot initialize Firebase Admin.');
  }

  return initializeApp({
    credential: cert(serviceAccount),
    // You might need to add other config options here, like databaseURL
    // projectId is usually inferred from the service account key.
  });
}

    