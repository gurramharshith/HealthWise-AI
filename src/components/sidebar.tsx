
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Bot,
  BrainCircuit,
  FileScan,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUserProfile } from "@/firebase";
import { signOut } from "firebase/auth";

const menuItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/dashboard/patients",
    icon: Users,
    label: "Patients",
    roles: ['admin', 'doctor']
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
  {
    href: "/dashboard/symptom-analyzer",
    icon: Search,
    label: "Symptom Analyzer",
  },
  {
    href: "/dashboard/health-report",
    icon: FileText,
    label: "Health Report",
  },
  {
    href: "/dashboard/admin",
    icon: ShieldCheck,
    label: "Admin",
    roles: ['admin']
  }
];

const bottomMenuItems = [
    {
        href: "/dashboard/settings",
        icon: Settings,
        label: "Settings",
    }
]

export default function AppSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { userProfile } = useUserProfile();
  const role = userProfile?.role;

  const handleSignOut = async () => {
    if (auth) {
        await signOut(auth);
    }
  };

  return (
    <Sidebar className="border-r bg-card/80 backdrop-blur-lg hidden lg:flex">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold group-data-[collapsible=icon]:hidden font-headline">
            HealthWise AI
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            if (item.roles && !item.roles.includes(role as string)) {
              return null;
            }
            return (
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
            )
           })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
          {bottomMenuItems.map((item) => (
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
           <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
                  <LogOut />
                  <span>Sign Out</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

    