"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useCharacter, createCharacter, updateCharacter } from "@/lib/db/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { AbilityScores } from "@/lib/db/types";

interface CharacterEditorProps {
  characterId: number | null;
  onClose: () => void;
}

export function CharacterEditor({ characterId, onClose }: CharacterEditorProps) {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const character = useCharacter(characterId || undefined);

  const [name, setName] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [level, setLevel] = useState("");
  const [hp, setHP] = useState("");
  const [maxHP, setMaxHP] = useState("");
  const [ac, setAC] = useState("");
  const [str, setStr] = useState("10");
  const [dex, setDex] = useState("10");
  const [con, setCon] = useState("10");
  const [int, setInt] = useState("10");
  const [wis, setWis] = useState("10");
  const [cha, setCha] = useState("10");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (character) {
      setName(character.name);
      setCharacterClass(character.class || "");
      setLevel(character.level?.toString() || "");
      setHP(character.hp.toString());
      setMaxHP(character.max_hp.toString());
      setAC(character.ac.toString());
      setStr(character.stats.str.toString());
      setDex(character.stats.dex.toString());
      setCon(character.stats.con.toString());
      setInt(character.stats.int.toString());
      setWis(character.stats.wis.toString());
      setCha(character.stats.cha.toString());
      setNotes(character.notes || "");
    }
  }, [character]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Character name is required");
      return;
    }

    if (!campaignId) {
      toast.error("Please select a campaign");
      return;
    }

    const stats: AbilityScores = {
      str: parseInt(str) || 10,
      dex: parseInt(dex) || 10,
      con: parseInt(con) || 10,
      int: parseInt(int) || 10,
      wis: parseInt(wis) || 10,
      cha: parseInt(cha) || 10,
    };

    try {
      if (characterId) {
        await updateCharacter(characterId, {
          name: name.trim(),
          class: characterClass.trim() || undefined,
          level: level ? parseInt(level) : undefined,
          hp: parseInt(hp) || 0,
          max_hp: parseInt(maxHP) || 0,
          ac: parseInt(ac) || 10,
          stats,
          notes: notes.trim() || undefined,
        });
        toast.success("Character updated");
      } else {
        await createCharacter({
          campaign_id: campaignId,
          name: name.trim(),
          class: characterClass.trim() || undefined,
          level: level ? parseInt(level) : undefined,
          hp: parseInt(hp) || 0,
          max_hp: parseInt(maxHP) || 0,
          ac: parseInt(ac) || 10,
          stats,
          notes: notes.trim() || undefined,
        });
        toast.success("Character created");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save character");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {characterId ? "Edit Character" : "New Character"}
        </h1>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="stats">Ability Scores</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Character name"
                  />
                </div>
                <div>
                  <Label>Class</Label>
                  <Input
                    value={characterClass}
                    onChange={(e) => setCharacterClass(e.target.value)}
                    placeholder="e.g., Fighter, Wizard"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Level</Label>
                  <Input
                    type="number"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label>Current HP *</Label>
                  <Input
                    type="number"
                    value={hp}
                    onChange={(e) => setHP(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Max HP *</Label>
                  <Input
                    type="number"
                    value={maxHP}
                    onChange={(e) => setMaxHP(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>AC *</Label>
                  <Input
                    type="number"
                    value={ac}
                    onChange={(e) => setAC(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Ability Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <Label>STR</Label>
                  <Input
                    type="number"
                    value={str}
                    onChange={(e) => setStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <Label>DEX</Label>
                  <Input
                    type="number"
                    value={dex}
                    onChange={(e) => setDex(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <Label>CON</Label>
                  <Input
                    type="number"
                    value={con}
                    onChange={(e) => setCon(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <Label>INT</Label>
                  <Input
                    type="number"
                    value={int}
                    onChange={(e) => setInt(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <Label>WIS</Label>
                  <Input
                    type="number"
                    value={wis}
                    onChange={(e) => setWis(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <Label>CHA</Label>
                  <Input
                    type="number"
                    value={cha}
                    onChange={(e) => setCha(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Background, personality traits, goals, etc."
                rows={10}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Character</Button>
      </div>
    </div>
  );
}
