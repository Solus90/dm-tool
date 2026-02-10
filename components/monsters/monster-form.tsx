"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useMonster, createMonster, updateMonster } from "@/lib/db/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { AbilityScores, Action } from "@/lib/db/types";

interface MonsterFormProps {
  monsterId?: number;
}

export function MonsterForm({ monsterId }: MonsterFormProps) {
  const router = useRouter();
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const monster = useMonster(monsterId);

  const [name, setName] = useState("");
  const [cr, setCR] = useState("");
  const [size, setSize] = useState("");
  const [type, setType] = useState("");
  const [alignment, setAlignment] = useState("");
  const [hp, setHP] = useState("");
  const [ac, setAC] = useState("");
  const [speed, setSpeed] = useState("");
  const [str, setStr] = useState("10");
  const [dex, setDex] = useState("10");
  const [con, setCon] = useState("10");
  const [int, setInt] = useState("10");
  const [wis, setWis] = useState("10");
  const [cha, setCha] = useState("10");

  useEffect(() => {
    if (monster) {
      setName(monster.name);
      setCR(monster.cr?.toString() || "");
      setSize(monster.size || "");
      setType(monster.type || "");
      setAlignment(monster.alignment || "");
      setHP(monster.max_hp.toString());
      setAC(monster.ac.toString());
      setSpeed(monster.speed || "");
      setStr(monster.stats.str.toString());
      setDex(monster.stats.dex.toString());
      setCon(monster.stats.con.toString());
      setInt(monster.stats.int.toString());
      setWis(monster.stats.wis.toString());
      setCha(monster.stats.cha.toString());
    }
  }, [monster]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Monster name is required");
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
      if (monsterId) {
        await updateMonster(monsterId, {
          name: name.trim(),
          cr: cr || undefined,
          size: size || undefined,
          type: type || undefined,
          alignment: alignment || undefined,
          hp: parseInt(hp) || 0,
          max_hp: parseInt(hp) || 0,
          ac: parseInt(ac) || 10,
          speed: speed || undefined,
          stats,
        });
        toast.success("Monster updated");
      } else {
        await createMonster({
          campaign_id: campaignId,
          name: name.trim(),
          cr: cr || undefined,
          size: size || undefined,
          type: type || undefined,
          alignment: alignment || undefined,
          hp: parseInt(hp) || 0,
          max_hp: parseInt(hp) || 0,
          ac: parseInt(ac) || 10,
          speed: speed || undefined,
          stats,
          source: "manual",
        });
        toast.success("Monster created");
      }
      router.push("/monsters");
    } catch (error) {
      toast.error("Failed to save monster");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {monsterId ? "Edit Monster" : "New Monster"}
        </h1>
        <Button variant="outline" onClick={() => router.push("/monsters")}>
          Cancel
        </Button>
      </div>

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
                placeholder="Monster name"
              />
            </div>
            <div>
              <Label>Challenge Rating</Label>
              <Input
                value={cr}
                onChange={(e) => setCR(e.target.value)}
                placeholder="e.g., 1, 1/2, 1/4"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Size</Label>
              <Input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., Medium"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g., Beast"
              />
            </div>
            <div>
              <Label>Alignment</Label>
              <Input
                value={alignment}
                onChange={(e) => setAlignment(e.target.value)}
                placeholder="e.g., Neutral"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Combat Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Hit Points *</Label>
              <Input
                type="number"
                value={hp}
                onChange={(e) => setHP(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Armor Class *</Label>
              <Input
                type="number"
                value={ac}
                onChange={(e) => setAC(e.target.value)}
                placeholder="10"
              />
            </div>
            <div>
              <Label>Speed</Label>
              <Input
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="e.g., 30 ft."
              />
            </div>
          </div>
        </CardContent>
      </Card>

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

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push("/monsters")}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Monster</Button>
      </div>
    </div>
  );
}
