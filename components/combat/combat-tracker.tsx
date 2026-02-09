"use client";

import { useState, useMemo, useEffect } from "react";
import { useActiveCombat, updateActiveCombat, deleteActiveCombat } from "@/lib/db/hooks";
import { useUIStore } from "@/lib/stores/ui-store";
import { useCombatStore } from "@/lib/stores/combat-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InitiativeList } from "./initiative-list";
import { QuickAddDialog } from "./quick-add-dialog";
import { ChevronRight, ChevronLeft, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Combatant } from "@/lib/db/types";

interface CombatTrackerProps {
  combatId: number;
}

export function CombatTracker({ combatId }: CombatTrackerProps) {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const activeCombat = useActiveCombat(campaignId || undefined);
  const [combatants, setCombatants] = useState<Combatant[]>(activeCombat?.combatants || []);
  const [round, setRound] = useState(activeCombat?.round || 1);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(activeCombat?.current_turn_index || 0);

  // Sync state with database
  useEffect(() => {
    if (activeCombat) {
      setCombatants(activeCombat.combatants);
      setRound(activeCombat.round);
      setCurrentTurnIndex(activeCombat.current_turn_index);
    }
  }, [activeCombat]);

  // Sort combatants by initiative (descending)
  const sortedCombatants = useMemo(() => {
    return [...combatants].sort((a, b) => b.initiative - a.initiative);
  }, [combatants]);

  const currentCombatant = sortedCombatants[currentTurnIndex];

  const handleNextTurn = () => {
    const nextIndex = (currentTurnIndex + 1) % sortedCombatants.length;
    setCurrentTurnIndex(nextIndex);
    if (nextIndex === 0) {
      setRound(round + 1);
    }
    saveCombatState(nextIndex, nextIndex === 0 ? round + 1 : round);
  };

  const handlePreviousTurn = () => {
    if (currentTurnIndex === 0 && round > 1) {
      setRound(round - 1);
      setCurrentTurnIndex(sortedCombatants.length - 1);
      saveCombatState(sortedCombatants.length - 1, round - 1);
    } else if (currentTurnIndex > 0) {
      const prevIndex = currentTurnIndex - 1;
      setCurrentTurnIndex(prevIndex);
      saveCombatState(prevIndex, round);
    }
  };

  const saveCombatState = async (turnIndex: number, newRound: number) => {
    if (!activeCombat) return;
    try {
      await updateActiveCombat(activeCombat.id!, {
        combatants,
        round: newRound,
        current_turn_index: turnIndex,
      });
    } catch (error) {
      toast.error("Failed to save combat state");
      console.error(error);
    }
  };

  const handleUpdateCombatant = (id: string, updates: Partial<Combatant>) => {
    const updated = combatants.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCombatants(updated);
    if (activeCombat) {
      updateActiveCombat(activeCombat.id!, { combatants: updated }).catch(() => {
        toast.error("Failed to update combatant");
      });
    }
  };

  const handleRemoveCombatant = (id: string) => {
    const updated = combatants.filter((c) => c.id !== id);
    setCombatants(updated);
    const newIndex = Math.min(currentTurnIndex, updated.length - 1);
    setCurrentTurnIndex(newIndex);
    if (activeCombat) {
      updateActiveCombat(activeCombat.id!, {
        combatants: updated,
        current_turn_index: newIndex,
      }).catch(() => {
        toast.error("Failed to remove combatant");
      });
    }
  };

  const handleAddCombatant = (combatant: Combatant) => {
    const updated = [...combatants, combatant];
    setCombatants(updated);
    if (activeCombat) {
      updateActiveCombat(activeCombat.id!, { combatants: updated }).catch(() => {
        toast.error("Failed to add combatant");
      });
    }
  };

  const handleEndCombat = async () => {
    if (!activeCombat) return;
    if (confirm("Are you sure you want to end this combat?")) {
      try {
        await deleteActiveCombat(activeCombat.id!);
        toast.success("Combat ended");
      } catch (error) {
        toast.error("Failed to end combat");
        console.error(error);
      }
    }
  };

  if (!activeCombat) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No active combat</p>
          <QuickAddDialog onAdd={handleAddCombatant} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Combat Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Combat Tracker</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Round {round}</Badge>
              <Button variant="outline" size="icon" onClick={handleEndCombat}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousTurn}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center min-w-[200px]">
                <p className="text-sm text-muted-foreground">Current Turn</p>
                <p className="text-lg font-semibold">
                  {currentCombatant?.name || "None"}
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={handleNextTurn}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <QuickAddDialog onAdd={handleAddCombatant} />
          </div>
        </CardContent>
      </Card>

      {/* Initiative Order */}
      <InitiativeList
        combatants={sortedCombatants}
        currentTurnIndex={currentTurnIndex}
        onUpdateCombatant={handleUpdateCombatant}
        onRemoveCombatant={handleRemoveCombatant}
      />
    </div>
  );
}
