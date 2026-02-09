/**
 * Database Schema for D&D DM Tool
 * 
 * This file sets up the IndexedDB database using Dexie.js, a powerful
 * wrapper around the browser's native IndexedDB API.
 * 
 * How it works:
 * - IndexedDB stores data locally in your browser (like a mini database)
 * - Data persists even when you close the tab or restart your computer
 * - Each user's browser has its own separate database
 * - No server required - everything runs client-side!
 * 
 * Schema versioning:
 * - Version 1 is the current schema
 * - If you add new tables or indexes, increment the version number
 * - Dexie handles migrations automatically
 * 
 * Index syntax in stores():
 * - "++id" = auto-incrementing primary key
 * - "campaign_id" = indexed field (for fast queries like "all monsters in campaign 1")
 * - Multiple fields separated by commas = multiple indexes
 * - Only index fields you'll query on (don't over-index)
 */

import Dexie, { type Table } from "dexie";
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

/**
 * DMDatabase Class
 * 
 * Main database instance. Defines all tables and their schemas.
 * Each table is typed with its data model and primary key type.
 * 
 * Usage:
 * import { db } from './database';
 * const campaigns = await db.campaigns.toArray();
 * await db.monsters.add(newMonster);
 */
export class DMDatabase extends Dexie {
  // Table declarations with TypeScript types
  // Table<DataType, PrimaryKeyType>
  campaigns!: Table<Campaign, number>;
  characters!: Table<Character, number>;
  monsters!: Table<Monster, number>;
  npcs!: Table<NPC, number>;
  magic_items!: Table<MagicItem, number>;
  encounters!: Table<Encounter, number>;
  active_combat!: Table<ActiveCombat, number>;
  sessions!: Table<Session, number>;

  constructor() {
    super("DMDatabase"); // Database name (shows in DevTools > Application > IndexedDB)

    // Define schema version 1 (original schema)
    // Only specify indexes here, NOT all fields!
    // Format: "++primaryKey, index1, index2, ..."
    this.version(1).stores({
      // Campaigns: indexed by id (auto), name, and created_at
      campaigns: "++id, name, created_at",
      
      // Characters: indexed by campaign_id (for filtering) and name/created_at (for sorting)
      characters: "++id, campaign_id, name, created_at",
      
      // Monsters: indexed by campaign_id, plus name/CR/source for filtering/sorting
      monsters: "++id, campaign_id, name, cr, source, created_at",
      
      // NPCs: indexed by campaign_id and name
      npcs: "++id, campaign_id, name, created_at",
      
      // Encounters: indexed by campaign_id and name
      encounters: "++id, campaign_id, name, created_at",
      
      // Active Combat: only one per campaign, indexed by campaign_id
      active_combat: "++id, campaign_id, updated_at",
      
      // Sessions: indexed by campaign_id and date (for timeline sorting)
      sessions: "++id, campaign_id, date, created_at",
    });

    // Version 2: Add magic_items table
    this.version(2).stores({
      // Add magic_items table: indexed by campaign_id, name, rarity, and source
      magic_items: "++id, campaign_id, name, rarity, source, created_at",
    });
  }
}

/**
 * Singleton Database Instance
 * 
 * Import this in your components/hooks to interact with the database.
 * It's created once and reused throughout the app.
 * 
 * Example usage:
 * import { db } from '@/lib/db/database';
 * 
 * // Add a new campaign
 * await db.campaigns.add({ name: "My Campaign", created_at: Date.now(), updated_at: Date.now() });
 * 
 * // Query campaigns
 * const allCampaigns = await db.campaigns.toArray();
 * const campaign = await db.campaigns.get(1); // Get by ID
 * 
 * // Update
 * await db.campaigns.update(1, { name: "Updated Name" });
 * 
 * // Delete
 * await db.campaigns.delete(1);
 */
export const db = new DMDatabase();
