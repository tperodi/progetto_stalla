"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import classNames from "classnames"
import {
  Home,
  BadgePlus,
  CalendarDays,
  CalendarClock,
  Stethoscope,
  BarChart2,
  Repeat,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/bovini", label: "Anagrafica Bovini", icon: BadgePlus },
  { href: "/dashboard/fecondazioni", label: "Fecondazioni", icon: CalendarDays },
  { href: "/dashboard/parti", label: "Parti", icon: CalendarClock },
  { href: "/dashboard/eventi", label: "Eventi Sanitari", icon: Stethoscope },
  { href: "/dashboard/statistiche", label: "Statistiche", icon: BarChart2 },
  { href: "/dashboard/sincronizzazione", label: "Sincronizzazioni", icon: Repeat },
  { href: "/", label: "Logout", icon: LogOut },
]

export function AppSidebar({
  mobileOpen = false,
  onCloseMobile,
}: {
  mobileOpen?: boolean
  onCloseMobile?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        toast.success("Logout effettuato")
        router.push("/") // oppure '/' se non hai pagina login
      } else {
        toast.error("Errore durante il logout")
      }
    } catch (error) {
      console.error("Errore logout:", error)
      toast.error("Errore di rete durante il logout")
    }
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <Sidebar
        collapsible="offcanvas"
        className={classNames(
          "fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 z-50 shadow-md transition-transform duration-300 md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-6 text-lg font-semibold">
              Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild>
                      {label === "Logout" ? (
                        <button
                          onClick={() => {
                            handleLogout()
                            onCloseMobile?.()
                          }}
                          className="flex items-center gap-2 p-2 rounded text-red-600 hover:bg-red-100"
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      ) : (
                        <Link
                          href={href}
                          onClick={onCloseMobile}
                          className={`flex items-center gap-2 p-2 rounded ${
                            pathname === href ? "bg-blue-100 text-blue-700" : ""
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
