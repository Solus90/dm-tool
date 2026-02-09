"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload } from "lucide-react";
import { downloadExport, uploadImport } from "@/lib/db/export";
import { SpellLookup } from "@/components/tools/spell-lookup";
import { MonsterLookup } from "@/components/tools/monster-lookup";
import { MagicItemLookup } from "@/components/tools/magic-item-lookup";
import { WeaponLookup } from "@/components/tools/weapon-lookup";
import { ArmorLookup } from "@/components/tools/armor-lookup";
import { ConditionReference } from "@/components/tools/condition-reference";
import { toast } from "sonner";
import { useRef } from "react";

export default function ToolsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("monsters");

  const handleExport = async () => {
    try {
      await downloadExport();
      toast.success("Database exported successfully");
    } catch (error) {
      toast.error("Failed to export database");
      console.error(error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm("Importing will replace all current data. Are you sure?")) {
      return;
    }

    try {
      await uploadImport(file);
      toast.success("Database imported successfully");
      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      toast.error("Failed to import database");
      console.error(error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Tools & Reference</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Reference tools and utilities for your campaign.
        </p>
      </div>

      {/* Data Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Backup or restore your campaign data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Export all your data as a JSON file for backup.
            </p>
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Import a previously exported JSON file. This will replace all current data.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reference Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Reference Tools</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile: Dropdown Select */}
          <div className="lg:hidden mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monsters">Monsters</SelectItem>
                <SelectItem value="spells">Spells</SelectItem>
                <SelectItem value="items">Magic Items</SelectItem>
                <SelectItem value="weapons">Weapons</SelectItem>
                <SelectItem value="armor">Armor</SelectItem>
                <SelectItem value="conditions">Conditions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop: Tabs */}
          <div className="hidden lg:block">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="monsters">Monsters</TabsTrigger>
              <TabsTrigger value="spells">Spells</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="weapons">Weapons</TabsTrigger>
              <TabsTrigger value="armor">Armor</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
            </TabsList>
          </div>

        <TabsContent value="monsters">
          <Card>
            <CardHeader>
              <CardTitle>Monster Lookup</CardTitle>
              <CardDescription>Search D&D 5e SRD monsters from Open5e</CardDescription>
            </CardHeader>
            <CardContent>
              <MonsterLookup />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spells">
          <Card>
            <CardHeader>
              <CardTitle>Spell Lookup</CardTitle>
              <CardDescription>Search D&D 5e SRD spells from Open5e</CardDescription>
            </CardHeader>
            <CardContent>
              <SpellLookup />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Magic Item Lookup</CardTitle>
              <CardDescription>Search D&D 5e SRD magic items from Open5e</CardDescription>
            </CardHeader>
            <CardContent>
              <MagicItemLookup />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weapons">
          <Card>
            <CardHeader>
              <CardTitle>Weapon Lookup</CardTitle>
              <CardDescription>Search D&D 5e SRD weapons from Open5e</CardDescription>
            </CardHeader>
            <CardContent>
              <WeaponLookup />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="armor">
          <Card>
            <CardHeader>
              <CardTitle>Armor Lookup</CardTitle>
              <CardDescription>Search D&D 5e SRD armor from Open5e</CardDescription>
            </CardHeader>
            <CardContent>
              <ArmorLookup />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions">
          <Card>
            <CardHeader>
              <CardTitle>Condition Reference</CardTitle>
              <CardDescription>Quick reference for D&D 5e conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <ConditionReference />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
