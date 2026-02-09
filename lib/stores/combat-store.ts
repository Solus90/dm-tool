import { create } from "zustand";
import type { Combatant } from "@/lib/db/types";

interface CombatState {
  selectedCombatantId: string | null;
  setSelectedCombatant: (id: string | null) => void;
  
  // Combat actions
  nextTurn: (combatants: Combatant[], currentIndex: number) => number;
  previousTurn: (currentIndex: number) => number;
}

export const useCombatStore = create<CombatState>((set) => ({
  selectedCombatantId: null,
  
  setSelectedCombatant: (id) => set({ selectedCombatantId: id }),
  
  nextTurn: (combatants, currentIndex) => {
    const nextIndex = (currentIndex + 1) % combatants.length;
    return nextIndex;
  },
  
  previousTurn: (currentIndex) => {
    // This will be handled by the component with access to combatants array
    return Math.max(0, currentIndex - 1);
  },
}));
