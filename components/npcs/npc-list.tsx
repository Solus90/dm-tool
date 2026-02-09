"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { NPC } from "@/lib/db/types";

interface NPCListProps {
  npcs: NPC[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function NPCList({ npcs, onEdit, onDelete }: NPCListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {npcs.map((npc) => (
        <Card key={npc.id}>
          <CardHeader>
            <CardTitle>{npc.name}</CardTitle>
            <CardDescription>
              {npc.role && <span>{npc.role}</span>}
              {npc.role && npc.location && <span> • </span>}
              {npc.location && <span>{npc.location}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {npc.notes && (
              <p className="text-sm text-muted-foreground line-clamp-3">{npc.notes}</p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(npc.id!)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(npc.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
