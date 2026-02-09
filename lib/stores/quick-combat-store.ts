import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuickCombatant {
  id: string;
  name: string;
  initiative: number;
  conditions: string[];
}

interface QuickCombatState {
  combatants: QuickCombatant[];
  round: number;
  currentTurnIndex: number;
  
  addCombatant: (name: string, initiative: number) => void;
  updateCombatant: (id: string, updates: Partial<QuickCombatant>) => void;
  removeCombatant: (id: string) => void;
  addCondition: (id: string, condition: string) => void;
  removeCondition: (id: string, condition: string) => void;
  nextTurn: () => void;
  previousTurn: () => void;
  resetCombat: () => void;
  clearAll: () => void;
}

export const useQuickCombatStore = create<QuickCombatState>()(
  persist(
    (set, get) => ({
      combatants: [],
      round: 1,
      currentTurnIndex: 0,
      
      addCombatant: (name, initiative) => {
        const newCombatant: QuickCombatant = {
          id: `${Date.now()}-${Math.random()}`,
          name,
          initiative,
          conditions: [],
        };
        set((state) => ({
          combatants: [...state.combatants, newCombatant].sort((a, b) => b.initiative - a.initiative),
        }));
      },
      
      updateCombatant: (id, updates) => {
        set((state) => {
          const updated = state.combatants.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          );
          // Re-sort if initiative changed
          if (updates.initiative !== undefined) {
            return { combatants: updated.sort((a, b) => b.initiative - a.initiative) };
          }
          return { combatants: updated };
        });
      },
      
      removeCombatant: (id) => {
        set((state) => {
          const filtered = state.combatants.filter((c) => c.id !== id);
          const newIndex = Math.min(state.currentTurnIndex, filtered.length - 1);
          return {
            combatants: filtered,
            currentTurnIndex: Math.max(0, newIndex),
          };
        });
      },
      
      addCondition: (id, condition) => {
        set((state) => ({
          combatants: state.combatants.map((c) =>
            c.id === id && !c.conditions.includes(condition)
              ? { ...c, conditions: [...c.conditions, condition] }
              : c
          ),
        }));
      },
      
      removeCondition: (id, condition) => {
        set((state) => ({
          combatants: state.combatants.map((c) =>
            c.id === id
              ? { ...c, conditions: c.conditions.filter((cond) => cond !== condition) }
              : c
          ),
        }));
      },
      
      nextTurn: () => {
        set((state) => {
          const nextIndex = (state.currentTurnIndex + 1) % state.combatants.length;
          return {
            currentTurnIndex: nextIndex,
            round: nextIndex === 0 ? state.round + 1 : state.round,
          };
        });
      },
      
      previousTurn: () => {
        set((state) => {
          if (state.currentTurnIndex === 0 && state.round > 1) {
            return {
              currentTurnIndex: state.combatants.length - 1,
              round: state.round - 1,
            };
          } else if (state.currentTurnIndex > 0) {
            return {
              currentTurnIndex: state.currentTurnIndex - 1,
            };
          }
          return state;
        });
      },
      
      resetCombat: () => {
        set({ round: 1, currentTurnIndex: 0 });
      },
      
      clearAll: () => {
        set({ combatants: [], round: 1, currentTurnIndex: 0 });
      },
    }),
    {
      name: "quick-combat-storage",
    }
  )
);
