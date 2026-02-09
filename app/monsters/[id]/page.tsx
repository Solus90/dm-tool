"use client";

import { use } from "react";
import { useMonster } from "@/lib/db/hooks";
import { StatBlock } from "@/components/monsters/stat-block";
import { Card, CardContent } from "@/components/ui/card";

export default function MonsterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const monsterId = parseInt(id);
  const monster = useMonster(monsterId);

  if (!monster) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Monster not found</p>
        </CardContent>
      </Card>
    );
  }

  return <StatBlock monster={monster} />;
}
