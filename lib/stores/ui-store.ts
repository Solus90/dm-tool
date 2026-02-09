import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  activeCampaignId: number | null;
  darkMode: boolean;
  
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveCampaign: (id: number | null) => void;
  setDarkMode: (dark: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeCampaignId: null,
      darkMode: true, // Default to dark mode
      
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setActiveCampaign: (id) => set({ activeCampaignId: id }),
      setDarkMode: (dark) => set({ darkMode: dark }),
    }),
    {
      name: "dm-tool-ui-storage",
    }
  )
);
