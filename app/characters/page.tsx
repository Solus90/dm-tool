"use client";

import { useState } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useCharacters, deleteCharacter } from "@/lib/db/hooks";
import { CharacterList } from "@/components/characters/character-list";
import { CharacterEditor } from "@/components/characters/character-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CharactersPage() {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const characters = useCharacters(campaignId || undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const filteredCharacters = characters?.filter(
    (char) =>
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.class?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!campaignId) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Please select a campaign to manage characters.</p>
        </CardContent>
      </Card>
    );
  }

  const handleNewCharacter = () => {
    setEditingId(null);
    setShowEditor(true);
  };

  const handleEditCharacter = (id: number) => {
    setEditingId(id);
    setShowEditor(true);
  };

  const handleDeleteCharacter = async (id: number) => {
    if (confirm("Are you sure you want to delete this character?")) {
      try {
        await deleteCharacter(id);
        toast.success("Character deleted");
      } catch (error) {
        toast.error("Failed to delete character");
        console.error(error);
      }
    }
  };

  if (showEditor) {
    return (
      <CharacterEditor
        characterId={editingId}
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
          <h1 className="text-3xl font-bold">Player Characters</h1>
          <p className="text-muted-foreground mt-2">
            Manage player character information for quick DM reference.
          </p>
        </div>
        <Button onClick={handleNewCharacter}>
          <Plus className="h-4 w-4 mr-2" />
          New Character
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredCharacters && filteredCharacters.length > 0 ? (
        <CharacterList
          characters={filteredCharacters}
          onEdit={handleEditCharacter}
          onDelete={handleDeleteCharacter}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No characters found" : "No characters yet"}
            </p>
            <Button onClick={handleNewCharacter}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Character
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
