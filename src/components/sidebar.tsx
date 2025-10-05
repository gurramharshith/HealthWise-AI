
"use client";

import {
  Sidebar,
  SidebarContent,
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
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
