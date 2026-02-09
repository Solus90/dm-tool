"use client";

import { useState } from "react";
import { useQuickCombatStore } from "@/lib/stores/quick-combat-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronRight, ChevronLeft, Trash2, RotateCcw, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DND_CONDITIONS } from "@/lib/data/conditions";
import { cn } from "@/lib/utils";

export default function QuickCombatPage() {
  const {
    combatants,
    round,
    currentTurnIndex,
    addCombatant,
    updateCombatant,
    removeCombatant,
    addCondition,
    removeCondition,
    nextTurn,
    previousTurn,
    resetCombat,
    clearAll,
  } = useQuickCombatStore();

  const [newName, setNewName] = useState("");
  const [newInitiative, setNewInitiative] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newInitiative) return;
    addCombatant(newName.trim(), parseInt(newInitiative));
    setNewName("");
    setNewInitiative("");
  };

  const currentCombatant = combatants[currentTurnIndex];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quick Combat Tracker</h1>
        <p className="text-muted-foreground mt-2">
          Simple initiative tracker - no campaign required. Perfect for quick battles!
        </p>
      </div>

      {/* Add Combatant */}
      <Card>
        <CardHeader>
          <CardTitle>Add Combatant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newInitiative) {
                  handleAdd();
                }
              }}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Initiative"
              value={newInitiative}
              onChange={(e) => setNewInitiative(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName) {
                  handleAdd();
                }
              }}
              className="w-32"
            />
            <Button onClick={handleAdd} disabled={!newName.trim() || !newInitiative}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Combat Controls */}
      {combatants.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={previousTurn}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center min-w-[200px]">
                  <p className="text-sm text-muted-foreground">Round {round}</p>
                  <p className="text-lg font-semibold">
                    {currentCombatant?.name || "None"}
                  </p>
                </div>
                <Button variant="outline" size="icon" onClick={nextTurn}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetCombat}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Round
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initiative List */}
      <div className="space-y-2">
        {combatants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Add combatants above to start tracking initiative
            </CardContent>
          </Card>
        ) : (
          combatants.map((combatant, index) => (
            <Card
              key={combatant.id}
              className={cn(
                "transition-all",
                index === currentTurnIndex && "ring-2 ring-primary"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Initiative Number */}
                  <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg px-3 py-2 min-w-[60px]">
                    <span className="text-xs text-muted-foreground">Init</span>
                    <Input
                      type="number"
                      value={combatant.initiative}
                      onChange={(e) =>
                        updateCombatant(combatant.id, {
                          initiative: parseInt(e.target.value) || 0,
                        })
                      }
                      className="h-8 w-14 text-center font-bold border-none bg-transparent p-0"
                    />
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <Input
                      value={combatant.name}
                      onChange={(e) =>
                        updateCombatant(combatant.id, { name: e.target.value })
                      }
                      className="font-semibold text-lg border-none bg-transparent p-0 h-auto"
                    />
                  </div>

                  {/* Conditions */}
                  <div className="flex-1 flex flex-wrap gap-2">
                    {combatant.conditions.map((condition) => (
                      <Badge key={condition} variant="secondary">
                        {condition}
                        <button
                          onClick={() => removeCondition(combatant.id, condition)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (value) addCondition(combatant.id, value);
                      }}
                    >
                      <SelectTrigger className="w-[140px] h-7">
                        <SelectValue placeholder="+ Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {DND_CONDITIONS.filter(
                          (c) => !combatant.conditions.includes(c.name)
                        ).map((condition) => (
                          <SelectItem key={condition.name} value={condition.name}>
                            {condition.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCombatant(combatant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
