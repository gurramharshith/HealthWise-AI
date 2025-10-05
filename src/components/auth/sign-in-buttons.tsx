
'use client';

import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


export function SignInButtons() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
      toast({
        title: 'Signed in successfully!',
        description: 'Welcome back.',
      });
    } catch (error: any) {
      console.error('Error signing in with Google: ', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'There was a problem with your sign-in request.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleGoogleSignIn} variant="outline">
        <Chrome className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>
    </div>
  );
}
