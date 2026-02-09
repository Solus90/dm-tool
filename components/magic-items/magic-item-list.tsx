"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { deleteMagicItem } from "@/lib/db/hooks";
import { toast } from "sonner";
import type { MagicItem } from "@/lib/db/types";

interface MagicItemListProps {
  items: MagicItem[];
  onEdit: (item: MagicItem) => void;
  onCreate: () => void;
}

export function MagicItemList({ items, onEdit, onCreate }: MagicItemListProps) {
  const handleDelete = async (item: MagicItem) => {
    if (!item.id) return;
    
    if (!confirm(`Delete ${item.name}?`)) return;

    try {
      await deleteMagicItem(item.id);
      toast.success("Magic item deleted");
    } catch (error) {
      toast.error("Failed to delete magic item");
      console.error(error);
    }
  };

  const getRarityColor = (rarity?: string) => {
    if (!rarity) return "outline";
    const lower = rarity.toLowerCase();
    if (lower === "legendary" || lower === "artifact") return "destructive";
    if (lower === "very rare") return "default";
    if (lower === "rare") return "default";
    if (lower === "uncommon") return "secondary";
    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Magic Items</CardTitle>
            <CardDescription>{items.length} items</CardDescription>
          </div>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No magic items yet.</p>
            <p className="text-sm">Create your first magic item to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onEdit(item)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold truncate">{item.name}</h4>
                    {item.rarity && (
                      <Badge variant={getRarityColor(item.rarity)} className="text-xs">
                        {item.rarity}
                      </Badge>
                    )}
                    {item.requires_attunement && (
                      <Badge variant="outline" className="text-xs">
                        Attunement
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {item.type && <span>{item.type}</span>}
                    {item.location && (
                      <>
                        <span>•</span>
                        <span>{item.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
