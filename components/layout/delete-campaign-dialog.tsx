"use client";

import { useState } from "react";
import { deleteCampaign } from "@/lib/db/hooks";
import { downloadCampaignExport } from "@/lib/db/export";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Download } from "lucide-react";
import { toast } from "sonner";

interface DeleteCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: number;
  campaignName: string;
  onDeleted: () => void;
}

export function DeleteCampaignDialog({
  open,
  onOpenChange,
  campaignId,
  campaignName,
  onDeleted,
}: DeleteCampaignDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [wantBackup, setWantBackup] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "delete") {
      toast.error('Please type "delete" to confirm');
      return;
    }

    setIsDeleting(true);

    try {
      // Download backup if requested
      if (wantBackup) {
        await downloadCampaignExport(campaignId, campaignName);
        toast.success("Campaign backup downloaded");
        // Give user time to see the download
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Delete the campaign
      await deleteCampaign(campaignId);
      toast.success("Campaign deleted");
      
      // Reset state and close
      setConfirmText("");
      setWantBackup(true);
      onOpenChange(false);
      onDeleted();
    } catch (error) {
      toast.error("Failed to delete campaign");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    setWantBackup(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Campaign
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the campaign{" "}
            <span className="font-semibold">{campaignName}</span> and all associated data:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-semibold mb-2">The following will be deleted:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• All characters</li>
              <li>• All monsters</li>
              <li>• All NPCs</li>
              <li>• All encounters</li>
              <li>• All session notes</li>
              <li>• Active combat data</li>
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="backup"
              checked={wantBackup}
              onCheckedChange={(checked) => setWantBackup(checked as boolean)}
            />
            <Label htmlFor="backup" className="text-sm cursor-pointer">
              <Download className="inline h-3 w-3 mr-1" />
              Download backup before deleting
            </Label>
          </div>

          <div>
            <Label htmlFor="confirm" className="text-sm">
              Type <span className="font-mono font-bold">delete</span> to confirm
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type 'delete' here"
              className="mt-2"
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== "delete" || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
