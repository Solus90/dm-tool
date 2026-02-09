"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMonsters, useCharacters } from "@/lib/db/hooks";
import { useUIStore } from "@/lib/stores/ui-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import type { Combatant } from "@/lib/db/types";

interface QuickAddDialogProps {
  onAdd: (combatant: Combatant) => void;
}

export function QuickAddDialog({ onAdd }: QuickAddDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [hp, setHP] = useState("");
  const [maxHP, setMaxHP] = useState("");
  const [ac, setAC] = useState("");
  const [initiative, setInitiative] = useState("");
  const [addType, setAddType] = useState<"custom" | "monster" | "character">("custom");
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>("");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");

  const campaignId = useUIStore((state) => state.activeCampaignId);
  const monsters = useMonsters(campaignId || undefined);
  const characters = useCharacters(campaignId || undefined);

  const handleRollInitiative = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    setInitiative(roll.toString());
  };

  const handleAdd = () => {
    if (addType === "monster" && selectedMonsterId) {
      const monster = monsters?.find((m) => m.id === parseInt(selectedMonsterId));
      if (monster) {
        const combatant: Combatant = {
          id: `monster-${Date.now()}`,
          type: "monster",
          reference_id: monster.id,
          name: monster.name,
          hp: monster.hp,
          max_hp: monster.max_hp,
          ac: monster.ac,
          initiative: parseInt(initiative) || 0,
          conditions: [],
        };
        onAdd(combatant);
        resetForm();
        setOpen(false);
        return;
      }
    }

    if (addType === "character" && selectedCharacterId) {
      const character = characters?.find((c) => c.id === parseInt(selectedCharacterId));
      if (character) {
        const combatant: Combatant = {
          id: `character-${Date.now()}`,
          type: "character",
          reference_id: character.id,
          name: character.name,
          hp: character.hp,
          max_hp: character.max_hp,
          ac: character.ac,
          initiative: parseInt(initiative) || 0,
          conditions: [],
        };
        onAdd(combatant);
        resetForm();
        setOpen(false);
        return;
      }
    }

    // Custom combatant
    if (!name || !hp || !maxHP || !ac) {
      toast.error("Please fill in all required fields");
      return;
    }

    const combatant: Combatant = {
      id: `custom-${Date.now()}`,
      type: "custom",
      name: name.trim(),
      hp: parseInt(hp),
      max_hp: parseInt(maxHP),
      ac: parseInt(ac),
      initiative: parseInt(initiative) || 0,
      conditions: [],
    };

    onAdd(combatant);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setName("");
    setHP("");
    setMaxHP("");
    setAC("");
    setInitiative("");
    setAddType("custom");
    setSelectedMonsterId("");
    setSelectedCharacterId("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Combatant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Combatant</DialogTitle>
          <DialogDescription>Add a new combatant to the encounter.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Add Type</Label>
            <Select value={addType} onValueChange={(value: "custom" | "monster" | "character") => setAddType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="monster">From Monsters</SelectItem>
                <SelectItem value="character">From Characters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {addType === "monster" && (
            <div>
              <Label>Monster</Label>
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
            </div>
          )}

          {addType === "character" && (
            <div>
              <Label>Character</Label>
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
            </div>
          )}

          {addType === "custom" && (
            <>
              <div>
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Combatant name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current HP</Label>
                  <Input
                    type="number"
                    value={hp}
                    onChange={(e) => setHP(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Max HP</Label>
                  <Input
                    type="number"
                    value={maxHP}
                    onChange={(e) => setMaxHP(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Label>AC</Label>
                <Input
                  type="number"
                  value={ac}
                  onChange={(e) => setAC(e.target.value)}
                  placeholder="10"
                />
              </div>
            </>
          )}

          <div>
            <Label>Initiative</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={initiative}
                onChange={(e) => setInitiative(e.target.value)}
                placeholder="0"
              />
              <Button type="button" variant="outline" onClick={handleRollInitiative}>
                <FontAwesomeIcon icon={faDiceD20} className="h-4 w-4 mr-1" />
                Roll
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
