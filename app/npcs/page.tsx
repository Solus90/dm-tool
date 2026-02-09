"use client";

import { useState } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useNPCs, deleteNPC } from "@/lib/db/hooks";
import { NPCList } from "@/components/npcs/npc-list";
import { NPCEditor } from "@/components/npcs/npc-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NPCsPage() {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const npcs = useNPCs(campaignId || undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const filteredNPCs = npcs?.filter(
    (npc) =>
      npc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      npc.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      npc.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!campaignId) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Please select a campaign to manage NPCs.</p>
        </CardContent>
      </Card>
    );
  }

  const handleNewNPC = () => {
    setEditingId(null);
    setShowEditor(true);
  };

  const handleEditNPC = (id: number) => {
    setEditingId(id);
    setShowEditor(true);
  };

  const handleDeleteNPC = async (id: number) => {
    if (confirm("Are you sure you want to delete this NPC?")) {
      try {
        await deleteNPC(id);
        toast.success("NPC deleted");
      } catch (error) {
        toast.error("Failed to delete NPC");
        console.error(error);
      }
    }
  };

  if (showEditor) {
    return (
      <NPCEditor
        npcId={editingId}
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
          <h1 className="text-3xl font-bold">NPCs</h1>
          <p className="text-muted-foreground mt-2">
            Manage non-player characters for your campaign.
          </p>
        </div>
        <Button onClick={handleNewNPC}>
          <Plus className="h-4 w-4 mr-2" />
          New NPC
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search NPCs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredNPCs && filteredNPCs.length > 0 ? (
        <NPCList
          npcs={filteredNPCs}
          onEdit={handleEditNPC}
          onDelete={handleDeleteNPC}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No NPCs found" : "No NPCs yet"}
            </p>
            <Button onClick={handleNewNPC}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First NPC
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
