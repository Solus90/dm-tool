"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HPTracker } from "./hp-tracker";
import { ConditionManager } from "./condition-manager";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Combatant } from "@/lib/db/types";

interface CombatantCardProps {
  combatant: Combatant;
  isCurrentTurn: boolean;
  onUpdate: (updates: Partial<Combatant>) => void;
  onRemove: () => void;
}

export function CombatantCard({
  combatant,
  isCurrentTurn,
  onUpdate,
  onRemove,
}: CombatantCardProps) {
  return (
    <Card
      className={cn(
        "transition-all",
        isCurrentTurn && "ring-2 ring-primary"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{combatant.name}</h3>
              <Badge variant="outline">Init: {combatant.initiative}</Badge>
              <Badge variant="secondary">AC: {combatant.ac}</Badge>
              {isCurrentTurn && (
                <Badge variant="default">Current Turn</Badge>
              )}
            </div>

            <HPTracker
              currentHP={combatant.hp}
              maxHP={combatant.max_hp}
              tempHP={combatant.temp_hp}
              onHPChange={(hp, tempHP) => onUpdate({ hp, temp_hp: tempHP })}
            />

            <ConditionManager
              conditions={combatant.conditions}
              onConditionsChange={(conditions) => onUpdate({ conditions })}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
