"use client";

import { use } from "react";
import { MonsterForm } from "@/components/monsters/monster-form";

export default function EditMonsterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const monsterId = parseInt(id);

  return <MonsterForm monsterId={monsterId} />;
}
