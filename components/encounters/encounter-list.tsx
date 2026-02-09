"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/stores/ui-store";
import { createActiveCombat, getActiveCombatByCampaign } from "@/lib/db/hooks";
import { toast } from "sonner";
import type { Encounter } from "@/lib/db/types";

interface EncounterListProps {
  encounters: Encounter[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function EncounterList({ encounters, onEdit, onDelete }: EncounterListProps) {
  const router = useRouter();
  const campaignId = useUIStore((state) => state.activeCampaignId);

  const handleStartCombat = async (encounter: Encounter) => {
    if (!campaignId) {
      toast.error("Please select a campaign");
      return;
    }

    try {
      // Check if there's already an active combat
      const existingCombat = await getActiveCombatByCampaign(campaignId);
      if (existingCombat) {
        if (!confirm("There is already an active combat. Do you want to replace it?")) {
          return;
        }
      }

      // Convert encounter combatants to combat combatants
      const combatants = encounter.combatants.map((template) => ({
        ...template,
        id: `${template.type}-${Date.now()}-${Math.random()}`,
        initiative: template.initiative || 0, // Ensure initiative is always a number
        conditions: [],
        temp_hp: undefined,
      }));

      await createActiveCombat({
        campaign_id: campaignId,
        combatants,
        round: 1,
        current_turn_index: 0,
      });

      toast.success("Combat started from encounter");
      router.push("/combat");
    } catch (error) {
      toast.error("Failed to start combat");
      console.error(error);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {encounters.map((encounter) => (
        <Card key={encounter.id}>
          <CardHeader>
            <CardTitle>{encounter.name}</CardTitle>
            <CardDescription>
              {encounter.combatants.length} combatant{encounter.combatants.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {encounter.difficulty && (
              <Badge variant="outline">{encounter.difficulty}</Badge>
            )}
            {encounter.notes && (
              <p className="text-sm text-muted-foreground line-clamp-2">{encounter.notes}</p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleStartCombat(encounter)}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-1" />
                Start Combat
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(encounter.id!)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(encounter.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
