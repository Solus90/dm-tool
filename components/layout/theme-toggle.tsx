"use client";

import { useUIStore } from "@/lib/stores/ui-store";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const darkMode = useUIStore((state) => state.darkMode);
  const setDarkMode = useUIStore((state) => state.setDarkMode);

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      <Moon className="h-4 w-4" />
    </div>
  );
}
