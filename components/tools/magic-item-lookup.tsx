"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles } from "lucide-react";
import { searchMagicItems, type Open5eMagicItem } from "@/lib/api/open5e";

export function MagicItemLookup() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Open5eMagicItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Open5eMagicItem | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const items = await searchMagicItems(query);
      setResults(items);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error searching magic items:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const lower = rarity.toLowerCase();
    if (lower.includes("legendary")) return "destructive";
    if (lower.includes("very rare")) return "default";
    if (lower.includes("rare")) return "default";
    if (lower.includes("uncommon")) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search magic items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {selectedItem ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {selectedItem.name}
                </CardTitle>
                <CardDescription>{selectedItem.type}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getRarityColor(selectedItem.rarity)}>
                  {selectedItem.rarity}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                  Back to Results
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedItem.requires_attunement && (
              <div className="text-sm font-medium text-muted-foreground italic">
                Requires Attunement {selectedItem.requires_attunement !== "requires_attunement" && `(${selectedItem.requires_attunement})`}
              </div>
            )}
            <div 
              className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2"
              dangerouslySetInnerHTML={{ __html: selectedItem.desc }}
            />
            {selectedItem.document__title && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Source: {selectedItem.document__title}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {results.map((item) => (
            <Card
              key={item.slug}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setSelectedItem(item)}
            >
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <CardDescription className="text-sm">{item.type}</CardDescription>
                  </div>
                  <Badge variant={getRarityColor(item.rarity)} className="text-xs">
                    {item.rarity}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
          {results.length === 0 && query && !loading && (
            <p className="text-center text-muted-foreground py-8">
              No magic items found. Try a different search term.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
