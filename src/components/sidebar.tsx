
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Bot,
  BrainCircuit,
  FileScan,
  LayoutDashboard,
  LogOut,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "./ui/button";

const menuItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/dashboard/image-analysis",
    icon: FileScan,
    label: "Image Analysis",
  },
  {
    href: "/dashboard/predictive-assessment",
    icon: BrainCircuit,
    label: "Predictive Assessment",
  },
  {
    href: "/dashboard/early-diagnosis",
    icon: Stethoscope,
    label: "Early Diagnosis",
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const auth = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">
              HealthWise AI
            </span>
            <div className="flex-1" />
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
                    <LogOut />
                    <span>Sign Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
