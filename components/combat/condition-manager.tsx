"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DND_CONDITIONS } from "@/lib/data/conditions";
import { Plus, X } from "lucide-react";
import type { Condition } from "@/lib/db/types";

interface ConditionManagerProps {
  conditions: Condition[];
  onConditionsChange: (conditions: Condition[]) => void;
}

export function ConditionManager({
  conditions,
  onConditionsChange,
}: ConditionManagerProps) {
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddCondition = () => {
    if (!selectedCondition) return;
    const condition = DND_CONDITIONS.find((c) => c.name === selectedCondition);
    if (condition && !conditions.find((c) => c.name === condition.name)) {
      onConditionsChange([...conditions, condition]);
      setSelectedCondition("");
      setDialogOpen(false);
    }
  };

  const handleRemoveCondition = (name: string) => {
    onConditionsChange(conditions.filter((c) => c.name !== name));
  };

  const availableConditions = DND_CONDITIONS.filter(
    (c) => !conditions.find((existing) => existing.name === c.name)
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {conditions.map((condition) => (
          <Badge key={condition.name} variant="secondary" className="gap-1">
            {condition.name}
            <button
              onClick={() => handleRemoveCondition(condition.name)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Add Condition
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Condition</DialogTitle>
              <DialogDescription>Select a condition to apply.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {availableConditions.map((condition) => (
                    <SelectItem key={condition.name} value={condition.name}>
                      {condition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCondition && (
                <div className="text-sm text-muted-foreground">
                  {DND_CONDITIONS.find((c) => c.name === selectedCondition)?.description}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleAddCondition} disabled={!selectedCondition}>
                Add Condition
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
