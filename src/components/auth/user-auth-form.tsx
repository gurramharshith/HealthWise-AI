
'use client';

import * as React from 'react';
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { SignInButtons } from './sign-in-buttons';

const formSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string().optional(),
    displayName: z.string().optional(),
  })
  .refine(
    (data) => {
      // If displayName is present, it's a signup form, and passwords must match
      if (data.displayName !== undefined) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
        // If it's a signup form, displayName is required
        if (data.confirmPassword !== undefined) {
            return !!data.displayName && data.displayName.length > 0;
        }
        return true;
    },
    {
        message: 'Display name is required.',
        path: ['displayName'],
    }
  );

type UserFormValues = z.infer<typeof formSchema>;

export function UserAuthForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSignUp, setIsSignUp] = React.useState<boolean>(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    if (!auth || !firestore) {
        toast({
            variant: "destructive",
            title: "Firebase Error",
            description: "Firebase is not initialized. Please try again later."
        });
        setIsLoading(false);
        return;
    }

    try {
      if (isSignUp) {
        // Handle Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;
        await updateProfile(user, { displayName: data.displayName });
        
        // Create user document in Firestore
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: data.displayName,
            role: 'doctor', // Default role for new sign-ups
            createdAt: serverTimestamp(),
        }, { merge: true });

        toast({
          title: 'Account created!',
          description: 'You have been signed in successfully.',
        });
      } else {
        // Handle Sign In
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({
          title: 'Signed in!',
          description: 'Welcome back.',
        });
      }
      router.push('/dashboard');
    } catch (error: any) {
        let description = 'An unexpected error occurred. Please try again.';
        if (error.code) {
            switch(error.code) {
                case 'auth/email-already-in-use':
                    description = 'This email is already in use. Try signing in instead.';
                    break;
                case 'auth/weak-password':
                    description = 'The password is too weak. Please choose a stronger password.';
                    break;

                case 'auth/invalid-credential':
                    description = 'Invalid credentials. Please check your email and password.';
                    break;
                default:
                    description = error.message;
            }
        }

      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('grid gap-6')}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isSignUp && (
             <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isSignUp && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button disabled={isLoading} className="w-full">
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSignUp ? 'Create account' : 'Sign In'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <SignInButtons />

       <p className="px-8 text-center text-sm text-muted-foreground">
            <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="underline underline-offset-4 hover:text-primary"
            >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
        </p>

    </div>
  );
}

    