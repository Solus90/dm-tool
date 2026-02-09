import { MonsterForm } from "@/components/monsters/monster-form";
import { Open5eImport } from "@/components/monsters/open5e-import";

export default function NewMonsterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Monster</h1>
        <Open5eImport />
      </div>
      <MonsterForm />
    </div>
  );
}
