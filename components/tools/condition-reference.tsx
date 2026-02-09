"use client";

import { useState } from "react";
import { DND_CONDITIONS } from "@/lib/data/conditions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function ConditionReference() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConditions = DND_CONDITIONS.filter((condition) =>
    condition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    condition.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search conditions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-3">
        {filteredConditions.map((condition) => (
          <Card key={condition.name}>
            <CardHeader className="py-3">
              <CardTitle className="text-base">{condition.name}</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <p className="text-sm text-muted-foreground">{condition.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
