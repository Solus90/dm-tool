"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Shield } from "lucide-react";
import { searchArmor, type Open5eArmor } from "@/lib/api/open5e";

export function ArmorLookup() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Open5eArmor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArmor, setSelectedArmor] = useState<Open5eArmor | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const armor = await searchArmor(query);
      setResults(armor);
      setSelectedArmor(null);
    } catch (error) {
      console.error("Error searching armor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search armor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {selectedArmor ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {selectedArmor.name}
                </CardTitle>
                <CardDescription>{selectedArmor.category}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {selectedArmor.cost && (
                  <Badge variant="outline">{selectedArmor.cost}</Badge>
                )}
                <Button variant="outline" size="sm" onClick={() => setSelectedArmor(null)}>
                  Back to Results
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {selectedArmor.armor_class && (
                <div>
                  <span className="font-medium">Armor Class:</span> {selectedArmor.armor_class}
                </div>
              )}
              {selectedArmor.weight && (
                <div>
                  <span className="font-medium">Weight:</span> {selectedArmor.weight}
                </div>
              )}
              {selectedArmor.strength_requirement && (
                <div>
                  <span className="font-medium">Strength Required:</span> {selectedArmor.strength_requirement}
                </div>
              )}
              {selectedArmor.stealth_disadvantage && (
                <div className="col-span-2">
                  <Badge variant="destructive">Stealth Disadvantage</Badge>
                </div>
              )}
            </div>

            {selectedArmor.desc && (
              <div 
                className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2"
                dangerouslySetInnerHTML={{ __html: selectedArmor.desc }}
              />
            )}

            {selectedArmor.document__title && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Source: {selectedArmor.document__title}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {results.map((armor) => (
            <Card
              key={armor.slug}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setSelectedArmor(armor)}
            >
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{armor.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {armor.category}
                      {armor.armor_class && ` • AC ${armor.armor_class}`}
                    </CardDescription>
                  </div>
                  {armor.cost && (
                    <Badge variant="outline" className="text-xs">
                      {armor.cost}
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
          {results.length === 0 && query && !loading && (
            <p className="text-center text-muted-foreground py-8">
              No armor found. Try a different search term.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
