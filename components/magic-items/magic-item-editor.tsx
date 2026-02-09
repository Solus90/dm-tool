"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles } from "lucide-react";
import { createMagicItem, updateMagicItem } from "@/lib/db/hooks";
import { toast } from "sonner";
import type { MagicItem } from "@/lib/db/types";

interface MagicItemEditorProps {
  item: MagicItem | null;
  isCreating: boolean;
  campaignId: number;
  onClose: () => void;
}

export function MagicItemEditor({ item, isCreating, campaignId, onClose }: MagicItemEditorProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [rarity, setRarity] = useState<string>("");
  const [requiresAttunement, setRequiresAttunement] = useState(false);
  const [attunementRequirements, setAttunementRequirements] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setType(item.type || "");
      setRarity(item.rarity || "");
      setRequiresAttunement(item.requires_attunement || false);
      setAttunementRequirements(item.attunement_requirements || "");
      setDescription(item.description || "");
      setLocation(item.location || "");
      setNotes(item.notes || "");
    } else if (isCreating) {
      // Reset form for new item
      setName("");
      setType("");
      setRarity("");
      setRequiresAttunement(false);
      setAttunementRequirements("");
      setDescription("");
      setLocation("");
      setNotes("");
    }
  }, [item, isCreating]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter an item name");
      return;
    }

    try {
      const itemData: Omit<MagicItem, "id" | "created_at" | "updated_at"> = {
        campaign_id: campaignId,
        name: name.trim(),
        type: type.trim() || undefined,
        rarity: (rarity as MagicItem["rarity"]) || undefined,
        requires_attunement: requiresAttunement,
        attunement_requirements: attunementRequirements.trim() || undefined,
        description: description.trim() || undefined,
        source: "manual",
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      if (item?.id) {
        await updateMagicItem(item.id, itemData);
        toast.success("Magic item updated");
      } else {
        await createMagicItem(itemData);
        toast.success("Magic item created");
      }

      onClose();
    } catch (error) {
      toast.error("Failed to save magic item");
      console.error(error);
    }
  };

  if (!isCreating && !item) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select an item to edit or create a new one</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item ? "Edit Magic Item" : "New Magic Item"}</CardTitle>
        <CardDescription>
          {item ? "Update magic item details" : "Create a new magic item for your campaign"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Flametongue, +1 Longsword"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., Weapon, Potion, Ring"
            />
          </div>

          <div>
            <Label htmlFor="rarity">Rarity</Label>
            <Select value={rarity} onValueChange={setRarity}>
              <SelectTrigger>
                <SelectValue placeholder="Select rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="very rare">Very Rare</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
                <SelectItem value="artifact">Artifact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="attunement"
              checked={requiresAttunement}
              onCheckedChange={(checked) => setRequiresAttunement(checked as boolean)}
            />
            <Label htmlFor="attunement" className="cursor-pointer">
              Requires Attunement
            </Label>
          </div>

          {requiresAttunement && (
            <Input
              value={attunementRequirements}
              onChange={(e) => setAttunementRequirements(e.target.value)}
              placeholder="e.g., by a spellcaster, by a cleric"
              className="ml-6"
            />
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item properties, abilities, and effects..."
            rows={6}
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., In vault, Given to Thorin"
          />
        </div>

        <div>
          <Label htmlFor="notes">DM Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Private notes about this item..."
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            {item ? "Update" : "Create"} Magic Item
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
