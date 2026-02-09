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
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Quick Combat Tracker</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Simple initiative tracker - no campaign required. Perfect for quick battles!
        </p>
      </div>

      {/* Add Combatant */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Add Combatant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
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
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Init"
                value={newInitiative}
                onChange={(e) => setNewInitiative(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName) {
                    handleAdd();
                  }
                }}
                className="w-24 sm:w-32"
              />
              <Button onClick={handleAdd} disabled={!newName.trim() || !newInitiative} className="flex-shrink-0">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Combat Controls */}
      {combatants.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="icon" onClick={previousTurn} className="flex-shrink-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center min-w-[150px] md:min-w-[200px]">
                  <p className="text-xs md:text-sm text-muted-foreground">Round {round}</p>
                  <p className="text-base md:text-lg font-semibold truncate px-2">
                    {currentCombatant?.name || "None"}
                  </p>
                </div>
                <Button variant="outline" size="icon" onClick={nextTurn} className="flex-shrink-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 justify-center md:justify-end">
                <Button variant="outline" onClick={resetCombat} size="sm" className="flex-1 md:flex-initial">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Reset Round</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
                <Button variant="outline" onClick={clearAll} size="sm" className="flex-1 md:flex-initial">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
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
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                  {/* Top Row: Initiative and Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Initiative Number */}
                    <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg px-2 md:px-3 py-2 min-w-[50px] md:min-w-[60px] flex-shrink-0">
                      <span className="text-xs text-muted-foreground">Init</span>
                      <Input
                        type="number"
                        value={combatant.initiative}
                        onChange={(e) =>
                          updateCombatant(combatant.id, {
                            initiative: parseInt(e.target.value) || 0,
                          })
                        }
                        className="h-7 md:h-8 w-12 md:w-14 text-center font-bold border-none bg-transparent p-0 text-sm md:text-base"
                      />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <Input
                        value={combatant.name}
                        onChange={(e) =>
                          updateCombatant(combatant.id, { name: e.target.value })
                        }
                        className="font-semibold text-base md:text-lg border-none bg-transparent p-0 h-auto"
                      />
                    </div>

                    {/* Remove Button - Mobile */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCombatant(combatant.id)}
                      className="flex-shrink-0 sm:hidden"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Conditions Row */}
                  <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                    {combatant.conditions.map((condition) => (
                      <Badge key={condition} variant="secondary" className="text-xs">
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
                      <SelectTrigger className="w-full sm:w-[140px] h-7 text-xs sm:text-sm">
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

                  {/* Remove Button - Desktop */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCombatant(combatant.id)}
                    className="hidden sm:flex flex-shrink-0"
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
