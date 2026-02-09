"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useEncounter, createEncounter, updateEncounter } from "@/lib/db/hooks";
import { useMonsters, useCharacters } from "@/lib/db/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import type { CombatantTemplate } from "@/lib/db/types";

interface EncounterEditorProps {
  encounterId: number | null;
  onClose: () => void;
}

export function EncounterEditor({ encounterId, onClose }: EncounterEditorProps) {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const encounter = useEncounter(encounterId || undefined);
  const monsters = useMonsters(campaignId || undefined);
  const characters = useCharacters(campaignId || undefined);

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "deadly" | "">("");
  const [notes, setNotes] = useState("");
  const [combatants, setCombatants] = useState<CombatantTemplate[]>([]);
  const [addType, setAddType] = useState<"monster" | "character" | "custom">("monster");
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>("");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");
  const [customName, setCustomName] = useState("");
  const [customHP, setCustomHP] = useState("");
  const [customAC, setCustomAC] = useState("");

  useEffect(() => {
    if (encounter) {
      setName(encounter.name);
      setDifficulty(encounter.difficulty || "");
      setNotes(encounter.notes || "");
      setCombatants(encounter.combatants);
    }
  }, [encounter]);

  const handleAddCombatant = () => {
    if (addType === "monster" && selectedMonsterId) {
      const monster = monsters?.find((m) => m.id === parseInt(selectedMonsterId));
      if (monster) {
        const template: CombatantTemplate = {
          id: `monster-${Date.now()}`,
          type: "monster",
          reference_id: monster.id,
          name: monster.name,
          hp: monster.hp,
          max_hp: monster.max_hp,
          ac: monster.ac,
        };
        setCombatants([...combatants, template]);
        setSelectedMonsterId("");
        return;
      }
    }

    if (addType === "character" && selectedCharacterId) {
      const character = characters?.find((c) => c.id === parseInt(selectedCharacterId));
      if (character) {
        const template: CombatantTemplate = {
          id: `character-${Date.now()}`,
          type: "character",
          reference_id: character.id,
          name: character.name,
          hp: character.hp,
          max_hp: character.max_hp,
          ac: character.ac,
        };
        setCombatants([...combatants, template]);
        setSelectedCharacterId("");
        return;
      }
    }

    if (addType === "custom" && customName && customHP && customAC) {
      const template: CombatantTemplate = {
        id: `custom-${Date.now()}`,
        type: "custom",
        name: customName,
        hp: parseInt(customHP),
        max_hp: parseInt(customHP),
        ac: parseInt(customAC),
      };
      setCombatants([...combatants, template]);
      setCustomName("");
      setCustomHP("");
      setCustomAC("");
    }
  };

  const handleRemoveCombatant = (id: string) => {
    setCombatants(combatants.filter((c) => c.id !== id));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Encounter name is required");
      return;
    }

    if (!campaignId) {
      toast.error("Please select a campaign");
      return;
    }

    if (combatants.length === 0) {
      toast.error("Add at least one combatant");
      return;
    }

    try {
      if (encounterId) {
        await updateEncounter(encounterId, {
          name: name.trim(),
          combatants,
          difficulty: difficulty || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success("Encounter updated");
      } else {
        await createEncounter({
          campaign_id: campaignId,
          name: name.trim(),
          combatants,
          difficulty: difficulty || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success("Encounter created");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save encounter");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {encounterId ? "Edit Encounter" : "New Encounter"}
        </h1>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Encounter Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Encounter name"
            />
          </div>

          <div>
            <Label>Difficulty (Optional)</Label>
            <Select value={difficulty || undefined} onValueChange={(value: "easy" | "medium" | "hard" | "deadly") => setDifficulty(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="deadly">Deadly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Combatants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Add Combatant</Label>
            <Select value={addType} onValueChange={(value: "monster" | "character" | "custom") => setAddType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monster">From Monsters</SelectItem>
                <SelectItem value="character">From Characters</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {addType === "monster" && (
              <div className="flex gap-2">
                <Select value={selectedMonsterId} onValueChange={setSelectedMonsterId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select monster" />
                  </SelectTrigger>
                  <SelectContent>
                    {monsters?.map((monster) => (
                      <SelectItem key={monster.id} value={monster.id!.toString()}>
                        {monster.name} (CR {monster.cr})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddCombatant} disabled={!selectedMonsterId}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            {addType === "character" && (
              <div className="flex gap-2">
                <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select character" />
                  </SelectTrigger>
                  <SelectContent>
                    {characters?.map((character) => (
                      <SelectItem key={character.id} value={character.id!.toString()}>
                        {character.name} {character.level && `(Level ${character.level})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddCombatant} disabled={!selectedCharacterId}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            {addType === "custom" && (
              <div className="grid grid-cols-4 gap-2">
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Name"
                />
                <Input
                  type="number"
                  value={customHP}
                  onChange={(e) => setCustomHP(e.target.value)}
                  placeholder="HP"
                />
                <Input
                  type="number"
                  value={customAC}
                  onChange={(e) => setCustomAC(e.target.value)}
                  placeholder="AC"
                />
                <Button onClick={handleAddCombatant} disabled={!customName || !customHP || !customAC}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {combatants.map((combatant) => (
              <div
                key={combatant.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <span className="font-medium">{combatant.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    HP: {combatant.hp} | AC: {combatant.ac}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCombatant(combatant.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Encounter</Button>
      </div>
    </div>
  );
}
