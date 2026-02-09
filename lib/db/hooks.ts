/**
 * Database Hooks and Operations
 * 
 * This file provides React hooks and utility functions for interacting
 * with the IndexedDB database. All hooks use useLiveQuery from Dexie,
 * which means they automatically re-render when data changes!
 * 
 * Pattern used throughout:
 * 1. useLiveQuery hooks - For reading data (auto-updates on changes)
 * 2. Async functions - For writing data (create, update, delete)
 * 
 * useLiveQuery benefits:
 * - Automatically subscribes to database changes
 * - Re-renders component when data updates
 * - Works across tabs (change data in one tab, see it update in another!)
 * - Returns undefined while loading, then the actual data
 * 
 * Important note about Dexie queries:
 * - You CANNOT chain .orderBy() after .where().equals()
 * - Instead, fetch with .toArray() then sort with JavaScript .sort()
 * - This is a Dexie limitation, not a bug in this code
 * 
 * Example usage in a component:
 * 
 * function MyComponent() {
 *   const campaigns = useCampaigns(); // Auto-updates!
 *   
 *   const handleCreate = async () => {
 *     const id = await createCampaign({ name: "New Campaign" });
 *     console.log(`Created campaign with ID: ${id}`);
 *   };
 * 
 *   return (
 *     <div>
 *       {campaigns?.map(c => <div key={c.id}>{c.name}</div>)}
 *     </div>
 *   );
 * }
 */

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./database";
import type {
  Campaign,
  Character,
  Monster,
  NPC,
  MagicItem,
  Encounter,
  ActiveCombat,
  Session,
} from "./types";

// ============================================================================
// CAMPAIGN HOOKS
// ============================================================================

/**
 * Get all campaigns, sorted by creation date (newest first)
 * @returns Array of campaigns, or undefined while loading
 */
export function useCampaigns() {
  return useLiveQuery(() => db.campaigns.orderBy("created_at").reverse().toArray());
}

export function useCampaign(id: number | undefined) {
  return useLiveQuery(() => (id ? db.campaigns.get(id) : undefined), [id]);
}

export async function createCampaign(data: Omit<Campaign, "id" | "created_at" | "updated_at">): Promise<number> {
  const now = Date.now();
  return await db.campaigns.add({
    ...data,
    created_at: now,
    updated_at: now,
  });
}

export async function updateCampaign(id: number, data: Partial<Campaign>): Promise<void> {
  await db.campaigns.update(id, {
    ...data,
    updated_at: Date.now(),
  });
}

/**
 * Delete a campaign and ALL associated data
 * WARNING: This is destructive! All characters, monsters, NPCs, magic items,
 * encounters, sessions, and active combat for this campaign will be permanently deleted.
 * Consider using exportCampaign() first to create a backup.
 */
export async function deleteCampaign(id: number): Promise<void> {
  // Delete all related data in parallel for performance
  // Promise.all runs all deletions simultaneously
  await Promise.all([
    db.characters.where("campaign_id").equals(id).delete(),
    db.monsters.where("campaign_id").equals(id).delete(),
    db.npcs.where("campaign_id").equals(id).delete(),
    db.magic_items.where("campaign_id").equals(id).delete(),
    db.encounters.where("campaign_id").equals(id).delete(),
    db.active_combat.where("campaign_id").equals(id).delete(),
    db.sessions.where("campaign_id").equals(id).delete(),
    db.campaigns.delete(id),
  ]);
}

// ============================================================================
// CHARACTER HOOKS
// ============================================================================
export function useCharacters(campaignId?: number) {
  return useLiveQuery(
    () =>
      campaignId
        ? db.characters.where("campaign_id").equals(campaignId).toArray()
        : db.characters.toArray(),
    [campaignId]
  );
}

export function useCharacter(id: number | undefined) {
  return useLiveQuery(() => (id ? db.characters.get(id) : undefined), [id]);
}

export async function createCharacter(data: Omit<Character, "id" | "created_at" | "updated_at">): Promise<number> {
  const now = Date.now();
  return await db.characters.add({
    ...data,
    created_at: now,
    updated_at: now,
  });
}

export async function updateCharacter(id: number, data: Partial<Character>): Promise<void> {
  await db.characters.update(id, {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteCharacter(id: number): Promise<void> {
  await db.characters.delete(id);
}

// ============================================================================
// MONSTER HOOKS
// ============================================================================
export function useMonsters(campaignId?: number) {
  return useLiveQuery(
    () =>
      campaignId
        ? db.monsters.where("campaign_id").equals(campaignId).toArray()
        : db.monsters.toArray(),
    [campaignId]
  );
}

export function useMonster(id: number | undefined) {
  return useLiveQuery(() => (id ? db.monsters.get(id) : undefined), [id]);
}

export async function createMonster(data: Omit<Monster, "id" | "created_at" | "updated_at">): Promise<number> {
  const now = Date.now();
  return await db.monsters.add({
    ...data,
    created_at: now,
    updated_at: now,
  });
}

export async function updateMonster(id: number, data: Partial<Monster>): Promise<void> {
  await db.monsters.update(id, {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteMonster(id: number): Promise<void> {
  await db.monsters.delete(id);
}

export async function searchMonsters(query: string, campaignId?: number): Promise<Monster[]> {
  const collection = campaignId
    ? db.monsters.where("campaign_id").equals(campaignId)
    : db.monsters.toCollection();
  const all = await collection.toArray();
  const lowerQuery = query.toLowerCase();
  return all.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.type?.toLowerCase().includes(lowerQuery) ||
      m.source?.toLowerCase().includes(lowerQuery)
  );
}

// ============================================================================
// NPC HOOKS
// ============================================================================
export function useNPCs(campaignId?: number) {
  return useLiveQuery(
    () =>
      campaignId
        ? db.npcs.where("campaign_id").equals(campaignId).toArray()
        : db.npcs.toArray(),
    [campaignId]
  );
}

export function useNPC(id: number | undefined) {
  return useLiveQuery(() => (id ? db.npcs.get(id) : undefined), [id]);
}

export async function createNPC(data: Omit<NPC, "id" | "created_at" | "updated_at">): Promise<number> {
  const now = Date.now();
  return await db.npcs.add({
    ...data,
    created_at: now,
    updated_at: now,
  });
}

export async function updateNPC(id: number, data: Partial<NPC>): Promise<void> {
  await db.npcs.update(id, {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteNPC(id: number): Promise<void> {
  await db.npcs.delete(id);
}

// ============================================================================
// MAGIC ITEM HOOKS
// ============================================================================
export function useMagicItems(campaignId?: number) {
  return useLiveQuery(
    () =>
      campaignId
        ? db.magic_items.where("campaign_id").equals(campaignId).toArray()
        : db.magic_items.toArray(),
    [campaignId]
  );
}

export function useMagicItem(id: number | undefined) {
  return useLiveQuery(() => (id ? db.magic_items.get(id) : undefined), [id]);
}

export async function createMagicItem(data: Omit<MagicItem, "id" | "created_at" | "updated_at">): Promise<number> {
  const now = Date.now();
  return await db.magic_items.add({
    ...data,
    created_at: now,
    updated_at: now,
  });
}

export async function updateMagicItem(id: number, data: Partial<MagicItem>): Promise<void> {
  await db.magic_items.update(id, {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteMagicItem(id: number): Promise<void> {
  await db.magic_items.delete(id);
}

// ============================================================================
// ENCOUNTER HOOKS
// ============================================================================
export function useEncounters(campaignId?: number) {
  return useLiveQuery(
    async () => {
      if (campaignId) {
        const encounters = await db.encounters.where("campaign_id").equals(campaignId).toArray();
        return encounters.sort((a, b) => b.created_at - a.created_at);
      }
      return await db.encounters.orderBy("created_at").reverse().toArray();
    },
    [campaignId]
  );
}

export function useEncounter(id: number | undefined) {
  return useLiveQuery(() => (id ? db.encounters.get(id) : undefined), [id]);
}

export async function createEncounter(data: Omit<Encounter, "id" | "created_at" | "updated_at">): Promise<number> {
  const now = Date.now();
  return await db.encounters.add({
    ...data,
    created_at: now,
    updated_at: now,
  });
}

export async function updateEncounter(id: number, data: Partial<Encounter>): Promise<void> {
  await db.encounters.update(id, {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteEncounter(id: number): Promise<void> {
  await db.encounters.delete(id);
}

// ============================================================================
// ACTIVE COMBAT HOOKS
// ============================================================================
export function useActiveCombat(campaignId?: number) {
  return useLiveQuery(
    () =>
      campaignId
        ? db.active_combat.where("campaign_id").equals(campaignId).first()
        : undefined,
    [campaignId]
  );
}

export async function createActiveCombat(data: Omit<ActiveCombat, "id" | "started_at" | "updated_at">): Promise<number> {
  const now = Date.now();
  return await db.active_combat.add({
    ...data,
    started_at: now,
    updated_at: now,
  });
}

export async function updateActiveCombat(id: number, data: Partial<ActiveCombat>): Promise<void> {
  await db.active_combat.update(id, {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteActiveCombat(id: number): Promise<void> {
  await db.active_combat.delete(id);
}

export async function getActiveCombatByCampaign(campaignId: number): Promise<ActiveCombat | undefined> {
  return await db.active_combat.where("campaign_id").equals(campaignId).first();
}

// ============================================================================
// SESSION HOOKS
// ============================================================================
export function useSessions(campaignId?: number) {
  return useLiveQuery(
    async () => {
      if (campaignId) {
        const sessions = await db.sessions.where("campaign_id").equals(campaignId).toArray();
        return sessions.sort((a, b) => b.date - a.date);
      }
      return await db.sessions.orderBy("date").reverse().toArray();
    },
    [campaignId]
  );
}

export function useSession(id: number | undefined) {
  return useLiveQuery(() => (id ? db.sessions.get(id) : undefined), [id]);
}

export async function createSession(data: Omit<Session, "id" | "created_at" | "updated_at">): Promise<number> {
  const now = Date.now();
  return await db.sessions.add({
    ...data,
    created_at: now,
    updated_at: now,
  });
}

export async function updateSession(id: number, data: Partial<Session>): Promise<void> {
  await db.sessions.update(id, {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteSession(id: number): Promise<void> {
  await db.sessions.delete(id);
}
