"use client";

import { CombatantCard } from "./combatant-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Combatant } from "@/lib/db/types";

interface InitiativeListProps {
  combatants: Combatant[];
  currentTurnIndex: number;
  onUpdateCombatant: (id: string, updates: Partial<Combatant>) => void;
  onRemoveCombatant: (id: string) => void;
}

export function InitiativeList({
  combatants,
  currentTurnIndex,
  onUpdateCombatant,
  onRemoveCombatant,
}: InitiativeListProps) {
  if (combatants.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No combatants in combat. Add combatants to begin.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-2">
        {combatants.map((combatant, index) => (
          <CombatantCard
            key={combatant.id}
            combatant={combatant}
            isCurrentTurn={index === currentTurnIndex}
            onUpdate={(updates) => onUpdateCombatant(combatant.id, updates)}
            onRemove={() => onRemoveCombatant(combatant.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
