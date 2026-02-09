"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useActiveCombat, createActiveCombat } from "@/lib/db/hooks";
import { CombatTracker } from "@/components/combat/combat-tracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sword } from "lucide-react";
import { toast } from "sonner";

export default function CombatPage() {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const activeCombat = useActiveCombat(campaignId || undefined);
  const [combatId, setCombatId] = useState<number | null>(null);

  useEffect(() => {
    if (activeCombat) {
      setCombatId(activeCombat.id!);
    } else {
      setCombatId(null);
    }
  }, [activeCombat]);

  const handleStartCombat = async () => {
    if (!campaignId) {
      toast.error("Please select a campaign first");
      return;
    }

    try {
      const id = await createActiveCombat({
        campaign_id: campaignId,
        combatants: [],
        round: 1,
        current_turn_index: 0,
      });
      setCombatId(id);
      toast.success("Combat started");
    } catch (error) {
      toast.error("Failed to start combat");
      console.error(error);
    }
  };

  if (!campaignId) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Please select a campaign to start combat.</p>
        </CardContent>
      </Card>
    );
  }

  if (!combatId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Combat Tracker</CardTitle>
          <CardDescription>Start a new combat encounter</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <Button onClick={handleStartCombat} size="lg" className="w-full sm:w-auto">
            <Sword className="h-5 w-5 mr-2" />
            Start New Combat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <CombatTracker combatId={combatId} />;
}
