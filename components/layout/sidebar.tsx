"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sword,
  Users,
  BookOpen,
  ScrollText,
  Settings,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUIStore } from "@/lib/stores/ui-store";
import { CampaignSelector } from "./campaign-selector";
import { ThemeToggle } from "./theme-toggle";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Quick Combat", href: "/quick-combat", icon: Sword },
  { name: "Combat", href: "/combat", icon: Sword },
  { name: "Encounters", href: "/encounters", icon: Sparkles },
  { name: "Monsters", href: "/monsters", icon: BookOpen },
  { name: "Characters", href: "/characters", icon: Users },
  { name: "NPCs", href: "/npcs", icon: Users },
  { name: "Sessions", href: "/sessions", icon: ScrollText },
  { name: "Tools", href: "/tools", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r bg-sidebar transition-transform duration-300",
          sidebarCollapsed ? "-translate-x-full" : "translate-x-0",
          "lg:translate-x-0" // Always visible on desktop
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <h1 className="text-lg font-semibold">DM Tool</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Campaign Selector */}
          <div className="border-b p-4">
            <CampaignSelector />
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="p-4">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        {item.name === "Quick Combat" ? (
                          <FontAwesomeIcon icon={faDiceD20} className="h-5 w-5" />
                        ) : (
                          <item.icon className="h-5 w-5" />
                        )}
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      {sidebarCollapsed && (
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-40 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}
