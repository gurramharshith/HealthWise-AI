"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/firebase";
import AppSidebar from "@/components/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AppHeader } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, isLoading } = useUserProfile();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Mark that we are running on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if user is not logged in
  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/");
    }
  }, [mounted, isLoading, user, router]);

  // Show loading skeleton until client check is complete and user is loaded
  if (!mounted || isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Skeleton className="h-screen w-full rounded-2xl" />
      </div>
    );
  }

  // Client-only rendering once user is loaded
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
