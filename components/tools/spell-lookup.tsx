"use client";

import { useState } from "react";
import { searchSpells } from "@/lib/api/open5e";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import type { Open5eSpell } from "@/lib/api/open5e";

export function SpellLookup() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Open5eSpell[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSpell, setSelectedSpell] = useState<Open5eSpell | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const spells = await searchSpells(searchQuery);
      setResults(spells);
      setSelectedSpell(null);
    } catch (error) {
      console.error("Failed to search spells:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search spells..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {selectedSpell ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedSpell.name}</CardTitle>
                <CardDescription>
                  {selectedSpell.level === "0" ? "Cantrip" : `Level ${selectedSpell.level}`} {selectedSpell.school}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedSpell(null)}>
                Back to Results
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Casting Time:</span>
                <p className="text-muted-foreground">{selectedSpell.casting_time}</p>
              </div>
              <div>
                <span className="font-semibold">Range:</span>
                <p className="text-muted-foreground">{selectedSpell.range}</p>
              </div>
              <div>
                <span className="font-semibold">Components:</span>
                <p className="text-muted-foreground">{selectedSpell.components}</p>
              </div>
              <div>
                <span className="font-semibold">Duration:</span>
                <p className="text-muted-foreground">
                  {selectedSpell.concentration === "yes" && "Concentration, "}
                  {selectedSpell.duration}
                </p>
              </div>
            </div>
            <div>
              <span className="font-semibold">Description:</span>
              <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                {selectedSpell.desc}
              </p>
            </div>
            {selectedSpell.higher_level && (
              <div>
                <span className="font-semibold">At Higher Levels:</span>
                <p className="text-sm text-muted-foreground mt-2">{selectedSpell.higher_level}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {results.map((spell) => (
            <Card key={spell.slug} className="cursor-pointer hover:bg-accent" onClick={() => setSelectedSpell(spell)}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{spell.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {spell.level === "0" ? "Cantrip" : `Level ${spell.level}`} {spell.school}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{spell.school}</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
