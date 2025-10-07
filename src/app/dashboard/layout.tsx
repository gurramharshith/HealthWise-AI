
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import AppSidebar from '@/components/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  // To prevent hydration errors, we show the skeleton loader until Firebase
  // has confirmed the user's authentication state on the client.
  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 lg:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="flex-1 p-4">
                <nav className="grid items-start gap-2 text-sm font-medium">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
              <Skeleton className="h-8 w-8 rounded-md md:hidden" />
              <div className="w-full flex-1">
                <Skeleton className="h-8 w-full max-w-sm" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </header>
            <main className="flex flex-col flex-1 p-4 sm:p-6 md:p-8">
              <Skeleton className="h-screen w-full rounded-2xl" />
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[auto_1fr]">
        <AppSidebar />
        <div className="flex flex-col">
          <AppHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/30 dark:bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
