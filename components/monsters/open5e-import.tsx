"use client";

import { useState } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { createMonster } from "@/lib/db/hooks";
import { searchMonsters, convertOpen5eMonster } from "@/lib/api/open5e";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download } from "lucide-react";
import { toast } from "sonner";
import type { Open5eMonster } from "@/lib/api/open5e";

export function Open5eImport() {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Open5eMonster[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setLoading(true);
    try {
      const results = await searchMonsters(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        toast.info("No monsters found");
      }
    } catch (error) {
      toast.error("Failed to search monsters");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (monster: Open5eMonster) => {
    if (!campaignId) {
      toast.error("Please select a campaign");
      return;
    }

    try {
      const monsterData = convertOpen5eMonster(monster, campaignId);
      await createMonster(monsterData);
      toast.success(`Imported ${monster.name}`);
      setOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      toast.error("Failed to import monster");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Import from Open5e
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Monster from Open5e</DialogTitle>
          <DialogDescription>
            Search for SRD monsters to import into your database.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search monsters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {searchResults.map((monster) => (
                <Card key={monster.slug}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{monster.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {monster.size} {monster.type} | CR {monster.challenge_rating}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">HP {monster.hit_points}</Badge>
                          <Badge variant="outline">AC {monster.armor_class}</Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleImport(monster)}
                      >
                        Import
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
