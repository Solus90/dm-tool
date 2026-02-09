// Open5e API client for D&D 5e SRD content

const OPEN5E_BASE_URL = "https://api.open5e.com";

export interface Open5eMonster {
  slug: string;
  name: string;
  size: string;
  type: string;
  subtype?: string;
  alignment: string;
  armor_class: number;
  hit_points: number;
  hit_dice: string;
  speed: {
    walk?: string;
    fly?: string;
    swim?: string;
    climb?: string;
    burrow?: string;
  };
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies?: Array<{
    name: string;
    value: number;
  }>;
  damage_vulnerabilities?: string[];
  damage_resistances?: string[];
  damage_immunities?: string[];
  condition_immunities?: string[];
  senses?: string;
  languages?: string;
  challenge_rating: string;
  special_abilities?: Array<{
    name: string;
    desc: string;
  }>;
  actions?: Array<{
    name: string;
    desc: string;
    attack_bonus?: number;
    damage_dice?: string;
    damage_bonus?: number;
  }>;
  legendary_actions?: Array<{
    name: string;
    desc: string;
  }>;
  reactions?: Array<{
    name: string;
    desc: string;
  }>;
}

export interface Open5eSpell {
  slug: string;
  name: string;
  desc: string;
  higher_level?: string;
  page?: string;
  range: string;
  components: string;
  material?: string;
  ritual: string;
  duration: string;
  concentration: string;
  casting_time: string;
  level: string;
  school: string;
  dnd_class: string;
  archetype?: string;
  circles?: string;
}

export interface Open5eResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function searchMonsters(query: string): Promise<Open5eMonster[]> {
  try {
    const response = await fetch(`${OPEN5E_BASE_URL}/monsters/?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch monsters");
    }
    const data = (await response.json()) as Open5eResponse<Open5eMonster>;
    return data.results;
  } catch (error) {
    console.error("Error searching monsters:", error);
    return [];
  }
}

export async function getMonsterBySlug(slug: string): Promise<Open5eMonster | null> {
  try {
    const response = await fetch(`${OPEN5E_BASE_URL}/monsters/${slug}/`);
    if (!response.ok) {
      throw new Error("Failed to fetch monster");
    }
    return (await response.json()) as Open5eMonster;
  } catch (error) {
    console.error("Error fetching monster:", error);
    return null;
  }
}

export async function searchSpells(query: string): Promise<Open5eSpell[]> {
  try {
    const response = await fetch(`${OPEN5E_BASE_URL}/spells/?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch spells");
    }
    const data = (await response.json()) as Open5eResponse<Open5eSpell>;
    return data.results;
  } catch (error) {
    console.error("Error searching spells:", error);
    return [];
  }
}

export async function getSpellBySlug(slug: string): Promise<Open5eSpell | null> {
  try {
    const response = await fetch(`${OPEN5E_BASE_URL}/spells/${slug}/`);
    if (!response.ok) {
      throw new Error("Failed to fetch spell");
    }
    return (await response.json()) as Open5eSpell;
  } catch (error) {
    console.error("Error fetching spell:", error);
    return null;
  }
}

// Convert Open5e monster to our Monster type
import type { Monster, AbilityScores, Action } from "@/lib/db/types";

export function convertOpen5eMonster(open5eMonster: Open5eMonster, campaignId: number): Omit<Monster, "id" | "created_at" | "updated_at"> {
  const stats: AbilityScores = {
    str: open5eMonster.strength,
    dex: open5eMonster.dexterity,
    con: open5eMonster.constitution,
    int: open5eMonster.intelligence,
    wis: open5eMonster.wisdom,
    cha: open5eMonster.charisma,
  };

  const actions: Action[] = [
    ...(open5eMonster.special_abilities?.map((ability) => ({
      name: ability.name,
      description: ability.desc,
      type: "other" as const,
    })) || []),
    ...(open5eMonster.actions?.map((action) => ({
      name: action.name,
      description: action.desc,
      type: action.attack_bonus ? ("melee" as const) : ("other" as const),
      attack_bonus: action.attack_bonus,
      damage: action.damage_dice ? `${action.damage_dice}${action.damage_bonus ? ` + ${action.damage_bonus}` : ""}` : undefined,
    })) || []),
    ...(open5eMonster.legendary_actions?.map((action) => ({
      name: action.name,
      description: action.desc,
      type: "other" as const,
    })) || []),
  ];

  const speedParts: string[] = [];
  if (open5eMonster.speed.walk) speedParts.push(`walk ${open5eMonster.speed.walk}`);
  if (open5eMonster.speed.fly) speedParts.push(`fly ${open5eMonster.speed.fly}`);
  if (open5eMonster.speed.swim) speedParts.push(`swim ${open5eMonster.speed.swim}`);
  if (open5eMonster.speed.climb) speedParts.push(`climb ${open5eMonster.speed.climb}`);
  if (open5eMonster.speed.burrow) speedParts.push(`burrow ${open5eMonster.speed.burrow}`);

  return {
    campaign_id: campaignId,
    name: open5eMonster.name,
    cr: open5eMonster.challenge_rating,
    size: open5eMonster.size,
    type: open5eMonster.type,
    alignment: open5eMonster.alignment,
    hp: open5eMonster.hit_points,
    max_hp: open5eMonster.hit_points,
    ac: open5eMonster.armor_class,
    speed: speedParts.join(", ") || undefined,
    stats,
    damage_resistances: open5eMonster.damage_resistances,
    damage_immunities: open5eMonster.damage_immunities,
    condition_immunities: open5eMonster.condition_immunities,
    senses: open5eMonster.senses,
    languages: open5eMonster.languages,
    actions,
    legendary_actions: open5eMonster.legendary_actions?.map((action) => ({
      name: action.name,
      description: action.desc,
      type: "other" as const,
    })),
    source: "srd",
    open5e_id: open5eMonster.slug,
  };
}
