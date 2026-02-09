"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useNPC, createNPC, updateNPC } from "@/lib/db/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface NPCEditorProps {
  npcId: number | null;
  onClose: () => void;
}

export function NPCEditor({ npcId, onClose }: NPCEditorProps) {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const npc = useNPC(npcId || undefined);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (npc) {
      setName(npc.name);
      setRole(npc.role || "");
      setLocation(npc.location || "");
      setNotes(npc.notes || "");
    }
  }, [npc]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("NPC name is required");
      return;
    }

    if (!campaignId) {
      toast.error("Please select a campaign");
      return;
    }

    try {
      if (npcId) {
        await updateNPC(npcId, {
          name: name.trim(),
          role: role.trim() || undefined,
          location: location.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success("NPC updated");
      } else {
        await createNPC({
          campaign_id: campaignId,
          name: name.trim(),
          role: role.trim() || undefined,
          location: location.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success("NPC created");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save NPC");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {npcId ? "Edit NPC" : "New NPC"}
        </h1>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>NPC Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="NPC name"
            />
          </div>

          <div>
            <Label>Role</Label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Innkeeper, Blacksmith, Quest Giver"
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Waterdeep, The Prancing Pony"
            />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Background, personality, secrets, etc."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save NPC</Button>
      </div>
    </div>
  );
}
