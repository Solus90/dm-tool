"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Skull } from "lucide-react";
import { searchMonsters, type Open5eMonster } from "@/lib/api/open5e";

export function MonsterLookup() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Open5eMonster[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState<Open5eMonster | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const monsters = await searchMonsters(query);
      setResults(monsters);
      setSelectedMonster(null);
    } catch (error) {
      console.error("Error searching monsters:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCRColor = (cr: string) => {
    const crNum = parseFloat(cr);
    if (crNum >= 20) return "destructive";
    if (crNum >= 10) return "default";
    if (crNum >= 5) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search monsters..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {selectedMonster ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Skull className="h-5 w-5" />
                  {selectedMonster.name}
                </CardTitle>
                <CardDescription>
                  {selectedMonster.size} {selectedMonster.type}
                  {selectedMonster.subtype && ` (${selectedMonster.subtype})`}, {selectedMonster.alignment}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getCRColor(selectedMonster.challenge_rating)}>
                  CR {selectedMonster.challenge_rating}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setSelectedMonster(null)}>
                  Back to Results
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">AC:</span> {selectedMonster.armor_class}
              </div>
              <div>
                <span className="font-medium">HP:</span> {selectedMonster.hit_points} ({selectedMonster.hit_dice})
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2 text-sm">
              <div className="text-center">
                <div className="font-medium">STR</div>
                <div>{selectedMonster.strength}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">DEX</div>
                <div>{selectedMonster.dexterity}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">CON</div>
                <div>{selectedMonster.constitution}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">INT</div>
                <div>{selectedMonster.intelligence}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">WIS</div>
                <div>{selectedMonster.wisdom}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">CHA</div>
                <div>{selectedMonster.charisma}</div>
              </div>
            </div>

            {selectedMonster.special_abilities && selectedMonster.special_abilities.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Special Abilities</h4>
                {selectedMonster.special_abilities.map((ability, i) => (
                  <div key={i} className="mb-3">
                    <span className="font-medium">{ability.name}. </span>
                    <span 
                      className="text-sm text-muted-foreground prose prose-sm dark:prose-invert inline"
                      dangerouslySetInnerHTML={{ __html: ability.desc }}
                    />
                  </div>
                ))}
              </div>
            )}

            {selectedMonster.actions && selectedMonster.actions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Actions</h4>
                {selectedMonster.actions.map((action, i) => (
                  <div key={i} className="mb-3">
                    <span className="font-medium">{action.name}. </span>
                    <span 
                      className="text-sm text-muted-foreground prose prose-sm dark:prose-invert inline"
                      dangerouslySetInnerHTML={{ __html: action.desc }}
                    />
                  </div>
                ))}
              </div>
            )}

            {selectedMonster.legendary_actions && selectedMonster.legendary_actions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Legendary Actions</h4>
                {selectedMonster.legendary_actions.map((action, i) => (
                  <div key={i} className="mb-3">
                    <span className="font-medium">{action.name}. </span>
                    <span 
                      className="text-sm text-muted-foreground prose prose-sm dark:prose-invert inline"
                      dangerouslySetInnerHTML={{ __html: action.desc }}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {results.map((monster) => (
            <Card
              key={monster.slug}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setSelectedMonster(monster)}
            >
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{monster.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {monster.size} {monster.type}
                    </CardDescription>
                  </div>
                  <Badge variant={getCRColor(monster.challenge_rating)} className="text-xs">
                    CR {monster.challenge_rating}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
          {results.length === 0 && query && !loading && (
            <p className="text-center text-muted-foreground py-8">
              No monsters found. Try a different search term.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
