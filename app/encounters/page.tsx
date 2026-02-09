"use client";

import { useState } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useEncounters, deleteEncounter } from "@/lib/db/hooks";
import { EncounterList } from "@/components/encounters/encounter-list";
import { EncounterEditor } from "@/components/encounters/encounter-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function EncountersPage() {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const encounters = useEncounters(campaignId || undefined);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  if (!campaignId) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Please select a campaign to manage encounters.</p>
        </CardContent>
      </Card>
    );
  }

  const handleNewEncounter = () => {
    setEditingId(null);
    setShowEditor(true);
  };

  const handleEditEncounter = (id: number) => {
    setEditingId(id);
    setShowEditor(true);
  };

  const handleDeleteEncounter = async (id: number) => {
    if (confirm("Are you sure you want to delete this encounter?")) {
      try {
        await deleteEncounter(id);
        toast.success("Encounter deleted");
      } catch (error) {
        toast.error("Failed to delete encounter");
        console.error(error);
      }
    }
  };

  if (showEditor) {
    return (
      <EncounterEditor
        encounterId={editingId}
        onClose={() => {
          setShowEditor(false);
          setEditingId(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Encounters</h1>
          <p className="text-muted-foreground mt-2">
            Build and save encounter templates to quickly start combat.
          </p>
        </div>
        <Button onClick={handleNewEncounter}>
          <Plus className="h-4 w-4 mr-2" />
          New Encounter
        </Button>
      </div>

      {encounters && encounters.length > 0 ? (
        <EncounterList
          encounters={encounters}
          onEdit={handleEditEncounter}
          onDelete={handleDeleteEncounter}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No encounters yet</p>
            <Button onClick={handleNewEncounter}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Encounter
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
