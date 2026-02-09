"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tools & Reference</h1>
        <p className="text-muted-foreground mt-2">
          Reference tools and utilities for your campaign.
        </p>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="monsters">Monsters</TabsTrigger>
          <TabsTrigger value="spells">Spells</TabsTrigger>
          <TabsTrigger value="items">Magic Items</TabsTrigger>
          <TabsTrigger value="weapons">Weapons</TabsTrigger>
          <TabsTrigger value="armor">Armor</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export & Import</CardTitle>
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
        </TabsContent>

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
  );
}
