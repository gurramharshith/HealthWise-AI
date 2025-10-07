
'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile as UserProfileType } from '@/lib/types';


/**
 * Hook to fetch the full user profile from Firestore.
 * This extends the basic auth user with data from the 'users' collection,
 * including the user's role.
 *
 * @returns An object containing the user profile data, loading state, and any errors.
 */
export const useUserProfile = () => {
  const { user, isUserLoading: isAuthLoading, userError: authError } = useUser();
  const firestore = useFirestore();

  // Create a memoized document reference to the user's profile
  const userProfileRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );

  // Use the useDoc hook to fetch the profile data in real-time
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useDoc<UserProfileType>(userProfileRef);

  // The overall loading state is true if either auth or profile is loading
  const isLoading = isAuthLoading || isProfileLoading;
  const error = authError || profileError;

  return { user, userProfile, isLoading, error };
};
