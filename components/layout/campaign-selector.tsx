"use client";

import { useEffect, useState } from "react";
import { useCampaigns, useCampaign, createCampaign } from "@/lib/db/hooks";
import { useUIStore } from "@/lib/stores/ui-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DeleteCampaignDialog } from "./delete-campaign-dialog";
import { toast } from "sonner";

export function CampaignSelector() {
  const campaigns = useCampaigns();
  const activeCampaignId = useUIStore((state) => state.activeCampaignId);
  const setActiveCampaign = useUIStore((state) => state.setActiveCampaign);
  const activeCampaign = useCampaign(activeCampaignId || undefined);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Set first campaign as active if none selected
  useEffect(() => {
    if (!activeCampaignId && campaigns && campaigns.length > 0) {
      setActiveCampaign(campaigns[0].id!);
    }
  }, [activeCampaignId, campaigns, setActiveCampaign]);

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) {
      toast.error("Campaign name is required");
      return;
    }

    try {
      const id = await createCampaign({
        name: newCampaignName.trim(),
        settings: {},
      });
      setActiveCampaign(id);
      setNewCampaignName("");
      setDialogOpen(false);
      toast.success("Campaign created");
    } catch (error) {
      toast.error("Failed to create campaign");
      console.error(error);
    }
  };

  const handleCampaignDeleted = () => {
    // Switch to another campaign if available
    if (campaigns && campaigns.length > 0) {
      const remainingCampaign = campaigns.find((c) => c.id !== activeCampaignId);
      if (remainingCampaign) {
        setActiveCampaign(remainingCampaign.id!);
      } else {
        setActiveCampaign(null);
      }
    }
  };

  const handleDeleteClick = () => {
    if (!activeCampaignId) {
      toast.error("No campaign selected");
      return;
    }
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-2">
      <Select
        value={activeCampaignId?.toString() || ""}
        onValueChange={(value) => setActiveCampaign(parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select campaign" />
        </SelectTrigger>
        <SelectContent>
          {campaigns?.map((campaign) => (
            <SelectItem key={campaign.id} value={campaign.id!.toString()}>
              {campaign.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Create a new campaign to organize your D&D sessions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Campaign name"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateCampaign();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteClick}
          disabled={!activeCampaignId}
          className="flex-1"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {activeCampaignId && activeCampaign && (
        <DeleteCampaignDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          campaignId={activeCampaignId}
          campaignName={activeCampaign.name}
          onDeleted={handleCampaignDeleted}
        />
      )}
    </div>
  );
}
