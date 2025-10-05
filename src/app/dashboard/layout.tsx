
import AppSidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-muted/30">
        {children}
      </main>
    </div>
  );
}
