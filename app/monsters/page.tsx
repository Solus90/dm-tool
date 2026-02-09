"use client";

import { useState } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useMonsters, deleteMonster } from "@/lib/db/hooks";
import { MonsterList } from "@/components/monsters/monster-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

export default function MonstersPage() {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const monsters = useMonsters(campaignId || undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMonsters = monsters?.filter(
    (monster) =>
      monster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monster.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monster.source?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!campaignId) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Please select a campaign to manage monsters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Monsters</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Browse and manage monster stat blocks. Import from Open5e or create custom monsters.
          </p>
        </div>
        <Link href="/monsters/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Monster
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search monsters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredMonsters && filteredMonsters.length > 0 ? (
        <MonsterList monsters={filteredMonsters} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No monsters found" : "No monsters yet"}
            </p>
            <Link href="/monsters/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Monster
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
