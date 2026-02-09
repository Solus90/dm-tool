"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sword } from "lucide-react";
import { searchWeapons, type Open5eWeapon } from "@/lib/api/open5e";

export function WeaponLookup() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Open5eWeapon[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState<Open5eWeapon | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const weapons = await searchWeapons(query);
      setResults(weapons);
      setSelectedWeapon(null);
    } catch (error) {
      console.error("Error searching weapons:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search weapons..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {selectedWeapon ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Sword className="h-5 w-5" />
                  {selectedWeapon.name}
                </CardTitle>
                <CardDescription>{selectedWeapon.category}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {selectedWeapon.cost && (
                  <Badge variant="outline">{selectedWeapon.cost}</Badge>
                )}
                <Button variant="outline" size="sm" onClick={() => setSelectedWeapon(null)}>
                  Back to Results
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {selectedWeapon.damage_dice && (
                <div>
                  <span className="font-medium">Damage:</span> {selectedWeapon.damage_dice}
                  {selectedWeapon.damage_type && ` ${selectedWeapon.damage_type}`}
                </div>
              )}
              {selectedWeapon.weight && (
                <div>
                  <span className="font-medium">Weight:</span> {selectedWeapon.weight}
                </div>
              )}
            </div>

            {selectedWeapon.properties && selectedWeapon.properties.length > 0 && (
              <div>
                <span className="font-medium text-sm">Properties: </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedWeapon.properties.map((prop, i) => (
                    <Badge key={i} variant="secondary">
                      {prop}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedWeapon.desc && (
              <div 
                className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2"
                dangerouslySetInnerHTML={{ __html: selectedWeapon.desc }}
              />
            )}

            {selectedWeapon.document__title && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Source: {selectedWeapon.document__title}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {results.map((weapon) => (
            <Card
              key={weapon.slug}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setSelectedWeapon(weapon)}
            >
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{weapon.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {weapon.category}
                      {weapon.damage_dice && ` • ${weapon.damage_dice}`}
                      {weapon.damage_type && ` ${weapon.damage_type}`}
                    </CardDescription>
                  </div>
                  {weapon.cost && (
                    <Badge variant="outline" className="text-xs">
                      {weapon.cost}
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
          {results.length === 0 && query && !loading && (
            <p className="text-center text-muted-foreground py-8">
              No weapons found. Try a different search term.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
