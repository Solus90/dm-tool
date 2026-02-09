/**
 * Main Layout Component
 * 
 * This is the root layout for the entire application. It provides:
 * - Sidebar navigation (collapsible on mobile, always visible on desktop)
 * - Main content area (where pages are rendered)
 * - Toast notifications (for success/error messages)
 * - Global keyboard shortcuts
 * 
 * Layout structure:
 * ┌─────────────────────────────────┐
 * │ Sidebar │ Main Content Area     │
 * │         │                       │
 * │ Nav     │ {children}            │
 * │ Links   │ (pages render here)   │
 * │         │                       │
 * │ Theme   │                       │
 * └─────────────────────────────────┘
 * 
 * Responsive behavior:
 * - Mobile: Sidebar hidden by default, opens as overlay
 * - Desktop (lg+): Sidebar always visible, content shifts right
 * 
 * Used in: app/layout.tsx (wraps all pages)
 */

"use client"; // Required for hooks and interactivity

import { Sidebar } from "./sidebar";
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts";
import { Toaster } from "@/components/ui/sonner";

export function MainLayout({ children }: { children: React.ReactNode }) {
  // Initialize global keyboard shortcuts (Cmd+K, etc.)
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar navigation - fixed position on desktop */}
      <Sidebar />
      
      {/* Main content area - scrollable, shifts right on desktop (lg:ml-64) */}
      <main className="flex-1 overflow-y-auto lg:ml-64 transition-all duration-300">
        <div className="container mx-auto p-6">
          {/* Page content renders here (from app router) */}
          {children}
        </div>
      </main>
      
      {/* Toast notifications - appears at bottom-right */}
      <Toaster />
    </div>
  );
}
