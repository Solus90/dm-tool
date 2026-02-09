"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface HPTrackerProps {
  currentHP: number;
  maxHP: number;
  tempHP?: number;
  onHPChange: (hp: number, tempHP?: number) => void;
}

export function HPTracker({ currentHP, maxHP, tempHP, onHPChange }: HPTrackerProps) {
  const [damageAmount, setDamageAmount] = useState("");
  const [healAmount, setHealAmount] = useState("");
  const [tempHPAmount, setTempHPAmount] = useState("");

  const handleDamage = () => {
    const amount = parseInt(damageAmount) || 0;
    if (amount > 0) {
      const newHP = Math.max(0, currentHP - amount);
      onHPChange(newHP, tempHP);
      setDamageAmount("");
    }
  };

  const handleHeal = () => {
    const amount = parseInt(healAmount) || 0;
    if (amount > 0) {
      const newHP = Math.min(maxHP, currentHP + amount);
      onHPChange(newHP, tempHP);
      setHealAmount("");
    }
  };

  const handleSetTempHP = () => {
    const amount = parseInt(tempHPAmount) || 0;
    if (amount >= 0) {
      onHPChange(currentHP, amount);
      setTempHPAmount("");
    }
  };

  const hpPercentage = (currentHP / maxHP) * 100;
  const isLowHP = hpPercentage < 0.5;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Heart className={cn("h-4 w-4", isLowHP && "text-destructive")} />
        <span className="text-sm font-medium">
          HP: {currentHP} / {maxHP}
        </span>
        {tempHP && tempHP > 0 && (
          <span className="text-xs text-muted-foreground">
            (+{tempHP} temp)
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Minus className="h-3 w-3 mr-1" />
              Damage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply Damage</DialogTitle>
              <DialogDescription>Enter the amount of damage to apply.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Damage Amount</Label>
                <Input
                  type="number"
                  value={damageAmount}
                  onChange={(e) => setDamageAmount(e.target.value)}
                  placeholder="0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleDamage();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleDamage}>Apply Damage</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Heal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply Healing</DialogTitle>
              <DialogDescription>Enter the amount of healing to apply.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Healing Amount</Label>
                <Input
                  type="number"
                  value={healAmount}
                  onChange={(e) => setHealAmount(e.target.value)}
                  placeholder="0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleHeal();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleHeal}>Apply Healing</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Temp HP
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Temporary HP</DialogTitle>
              <DialogDescription>Set the amount of temporary hit points.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Temporary HP</Label>
                <Input
                  type="number"
                  value={tempHPAmount}
                  onChange={(e) => setTempHPAmount(e.target.value)}
                  placeholder={tempHP?.toString() || "0"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSetTempHP();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSetTempHP}>Set Temp HP</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
