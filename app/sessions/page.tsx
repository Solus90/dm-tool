"use client";

import { useState } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useSessions, deleteSession } from "@/lib/db/hooks";
import { SessionList } from "@/components/sessions/session-list";
import { SessionEditor } from "@/components/sessions/session-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function SessionsPage() {
  const campaignId = useUIStore((state) => state.activeCampaignId);
  const sessions = useSessions(campaignId || undefined);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  if (!campaignId) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Please select a campaign to manage sessions.</p>
        </CardContent>
      </Card>
    );
  }

  const handleNewSession = () => {
    setEditingId(null);
    setShowEditor(true);
  };

  const handleEditSession = (id: number) => {
    setEditingId(id);
    setShowEditor(true);
  };

  const handleDeleteSession = async (id: number) => {
    if (confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteSession(id);
        toast.success("Session deleted");
      } catch (error) {
        toast.error("Failed to delete session");
        console.error(error);
      }
    }
  };

  if (showEditor) {
    return (
      <SessionEditor
        sessionId={editingId}
        onClose={() => {
          setShowEditor(false);
          setEditingId(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Session Notes</h1>
          <p className="text-muted-foreground mt-2">
            Track session recaps, notes, and campaign timeline.
          </p>
        </div>
        <Button onClick={handleNewSession}>
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </div>

      {sessions && sessions.length > 0 ? (
        <SessionList
          sessions={sessions}
          onEdit={handleEditSession}
          onDelete={handleDeleteSession}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No sessions yet</p>
            <Button onClick={handleNewSession}>
              <Plus className="h-4 w-4 mr-2" />
              Record Your First Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
