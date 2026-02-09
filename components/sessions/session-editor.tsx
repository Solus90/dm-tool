"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useSession, createSession, updateSession } from "@/lib/db/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SessionEditorProps {
  sessionId: number | null;
  onClose: () => void;
}

export function SessionEditor({ sessionId, onClose }: SessionEditorProps) {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const session = useSession(sessionId || undefined);

  const [date, setDate] = useState("");
  const [recap, setRecap] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (session) {
      setDate(new Date(session.date).toISOString().split("T")[0]);
      setRecap(session.recap || "");
      setNotes(session.notes || "");
    } else {
      // Default to today
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [session]);

  const handleSave = async () => {
    if (!date) {
      toast.error("Session date is required");
      return;
    }

    if (!campaignId) {
      toast.error("Please select a campaign");
      return;
    }

    try {
      const timestamp = new Date(date).getTime();

      if (sessionId) {
        await updateSession(sessionId, {
          date: timestamp,
          recap: recap.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success("Session updated");
      } else {
        await createSession({
          campaign_id: campaignId,
          date: timestamp,
          recap: recap.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success("Session created");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save session");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {sessionId ? "Edit Session" : "New Session"}
        </h1>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Date *</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Recap</Label>
            <Textarea
              value={recap}
              onChange={(e) => setRecap(e.target.value)}
              placeholder="What happened in this session?"
              rows={8}
            />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Important events, plot hooks, decisions, etc."
              rows={8}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Session</Button>
      </div>
    </div>
  );
}
