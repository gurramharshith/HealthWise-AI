
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Bot, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { UserAuthForm } from '@/components/auth/user-auth-form';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // It marks that we are now safely on the client and can show client-specific UI.
    setHasChecked(true);
  }, []);

  useEffect(() => {
    // This effect handles redirecting the user once their auth state is known.
    if (!isUserLoading && user && hasChecked) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router, hasChecked]);

  // Always show the loading state on the server and during the initial client render
  // to prevent a hydration mismatch. The UI will switch to the login form only after
  // the `hasChecked` state is true on the client.
  if (isUserLoading || !hasChecked || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Bot className="h-12 w-12 text-primary animate-pulse" />
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your experience...</p>
        </div>
      </div>
    );
  }

  // This part will only render on the client, after the initial check,
  // and only if the user is not logged in.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-4 right-4">
        <Link href="/landing" className="text-sm text-primary hover:underline">
          Go to Landing Page
        </Link>
      </div>
      <Card className="w-full max-w-md border-0 md:border shadow-none md:shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome to HealthWise AI</CardTitle>
          <CardDescription>
            Sign in or create an account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm />
        </CardContent>
      </Card>
    </div>
  );
}
