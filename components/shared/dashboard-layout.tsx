"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Toaster } from "sonner";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      {/* ✅ SidebarTrigger deve avere un solo elemento figlio diretto */}
      {isMobile && (
  <SidebarTrigger 
  icon={<Menu className="w-10 h-10 text-gray-700 dark:text-white" />}
  className="fixed top-2 left-2 z-50 h-10 w-10 p-4 bg-white dark:bg-zinc-900 rounded-md shadow">
    <button
      aria-label="Apri menu"
      className="fixed top-16 left-10 z-50 p-4 dark:bg-zinc-900 bg-white rounded-md shadow"
    >
      <Menu className="w-10 h-10 text-gray-700 dark:text-white" />
    </button>
  </SidebarTrigger>
)}




      <div className="flex flex-col md:flex-row min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full px-4 mt-16 mb-10 sm:px-6 md:px-8 overflow-x-auto">
          {children}
        </main>
      </div>

      <Toaster />
    </SidebarProvider>
  );
}
