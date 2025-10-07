
'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to HealthWise AI</CardTitle>
          <CardDescription>
            Sign in or create an account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm />
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href="/landing" className="underline">
          Learn more about HealthWise AI
        </Link>
      </p>
    </div>
  );
}
