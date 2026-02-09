"use client";

import { useState } from "react";
import { useMagicItems } from "@/lib/db/hooks";
import { useUIStore } from "@/lib/stores/ui-store";
import { MagicItemList } from "@/components/magic-items/magic-item-list";
import { MagicItemEditor } from "@/components/magic-items/magic-item-editor";
import type { MagicItem } from "@/lib/db/types";

export default function MagicItemsPage() {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const magicItems = useMagicItems(campaignId || undefined);
  const [selectedItem, setSelectedItem] = useState<MagicItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (item: MagicItem) => {
    setSelectedItem(item);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setIsCreating(true);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setIsCreating(false);
  };

  if (!campaignId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Campaign Selected</h2>
          <p className="text-muted-foreground">
            Please select or create a campaign to manage magic items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Magic Items</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Track custom magic items, homebrew creations, and items given to players.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <MagicItemList
          items={magicItems || []}
          onEdit={handleEdit}
          onCreate={handleCreate}
        />
        <MagicItemEditor
          item={selectedItem}
          isCreating={isCreating}
          campaignId={campaignId}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}
