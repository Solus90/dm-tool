"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { deleteMonster } from "@/lib/db/hooks";
import { toast } from "sonner";
import type { Monster } from "@/lib/db/types";

interface MonsterListProps {
  monsters: Monster[];
}

export function MonsterList({ monsters }: MonsterListProps) {
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this monster?")) {
      try {
        await deleteMonster(id);
        toast.success("Monster deleted");
      } catch (error) {
        toast.error("Failed to delete monster");
        console.error(error);
      }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {monsters.map((monster) => (
        <Card key={monster.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{monster.name}</CardTitle>
                <CardDescription>
                  {monster.type} {monster.size && `(${monster.size})`}
                </CardDescription>
              </div>
              {monster.source === "srd" && (
                <Badge variant="secondary">SRD</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {monster.cr && <Badge variant="outline">CR {monster.cr}</Badge>}
              <Badge variant="outline">HP {monster.max_hp}</Badge>
              <Badge variant="outline">AC {monster.ac}</Badge>
            </div>
            <div className="flex gap-2">
              <Link href={`/monsters/${monster.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
              <Link href={`/monsters/${monster.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(monster.id!)}
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
