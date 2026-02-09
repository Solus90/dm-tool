"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Heart, Shield } from "lucide-react";
import type { Character } from "@/lib/db/types";

interface CharacterListProps {
  characters: Character[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function CharacterList({ characters, onEdit, onDelete }: CharacterListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {characters.map((character) => (
        <Card key={character.id}>
          <CardHeader>
            <CardTitle>{character.name}</CardTitle>
            <CardDescription>
              {character.level && `Level ${character.level} `}
              {character.class}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">
                <Heart className="h-3 w-3 mr-1" />
                HP {character.hp}/{character.max_hp}
              </Badge>
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                AC {character.ac}
              </Badge>
            </div>
            {character.notes && (
              <p className="text-sm text-muted-foreground line-clamp-2">{character.notes}</p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(character.id!)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(character.id!)}
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
