/**
 * Database Export/Import Functionality
 * 
 * This file handles backing up and restoring data as JSON files.
 * 
 * Why export/import?
 * - **Backup**: Protect against browser data loss (cache clearing, reinstall, etc.)
 * - **Transfer**: Move data between browsers or computers
 * - **Share**: Share campaigns with other DMs
 * - **Version Control**: Keep snapshots of campaign state over time
 * 
 * The export format is plain JSON, which is:
 * - Human-readable (can open in text editor)
 * - Version-controlled (can commit to git)
 * - Portable (works anywhere JSON is supported)
 * - Future-proof (easy to migrate between schema versions)
 * 
 * Note: Active combat is NOT included in exports. This is intentional -
 * we only export saved state (encounters), not in-progress battles.
 */

import { db } from "./database";
import type { DatabaseExport } from "./types";

/**
 * Export format version
 * Increment this if you change the export structure.
 * Used for handling migrations in the future.
 */
const EXPORT_VERSION = "1.0.0";

/**
 * Export entire database
 * 
 * Exports ALL campaigns and their associated data.
 * Use this for full backups or when moving to a new browser.
 * 
 * @returns DatabaseExport object with all data
 */
export async function exportDatabase(): Promise<DatabaseExport> {
  // Fetch all tables in parallel for speed
  const [campaigns, characters, monsters, npcs, magic_items, encounters, sessions] = await Promise.all([
    db.campaigns.toArray(),
    db.characters.toArray(),
    db.monsters.toArray(),
    db.npcs.toArray(),
    db.magic_items.toArray(),
    db.encounters.toArray(),
    db.sessions.toArray(),
  ]);

  return {
    version: EXPORT_VERSION,
    exported_at: Date.now(),
    campaigns,
    characters,
    monsters,
    npcs,
    magic_items,
    encounters,
    sessions,
  };
}

/**
 * Export a single campaign
 * 
 * Exports only the specified campaign and its related data.
 * Useful for sharing individual campaigns or creating campaign-specific backups.
 * 
 * @param campaignId - The ID of the campaign to export
 * @returns DatabaseExport object with only the specified campaign's data
 * @throws Error if campaign doesn't exist
 */
export async function exportCampaign(campaignId: number): Promise<DatabaseExport> {
  // Fetch campaign and all related data in parallel
  const [campaign, characters, monsters, npcs, magic_items, encounters, sessions] = await Promise.all([
    db.campaigns.get(campaignId),
    db.characters.where("campaign_id").equals(campaignId).toArray(),
    db.monsters.where("campaign_id").equals(campaignId).toArray(),
    db.npcs.where("campaign_id").equals(campaignId).toArray(),
    db.magic_items.where("campaign_id").equals(campaignId).toArray(),
    db.encounters.where("campaign_id").equals(campaignId).toArray(),
    db.sessions.where("campaign_id").equals(campaignId).toArray(),
  ]);

  return {
    version: EXPORT_VERSION,
    exported_at: Date.now(),
    campaigns: campaign ? [campaign] : [],
    characters,
    monsters,
    npcs,
    magic_items,
    encounters,
    sessions,
  };
}

/**
 * Import database from export data
 * 
 * **WARNING: This DELETES all existing data before importing!**
 * This is a full restore operation, not a merge.
 * 
 * Process:
 * 1. Clear all existing tables
 * 2. Import data from export file
 * 3. Preserve original IDs (so references stay valid)
 * 
 * @param data - The DatabaseExport object to import
 * @throws Error if data format is invalid
 */
export async function importDatabase(data: DatabaseExport): Promise<void> {
  // Step 1: Clear existing data (all tables)
  // This is destructive but necessary for clean import
  await Promise.all([
    db.campaigns.clear(),
    db.characters.clear(),
    db.monsters.clear(),
    db.npcs.clear(),
    db.magic_items.clear(),
    db.encounters.clear(),
    db.active_combat.clear(), // Clear active combat on import
    db.sessions.clear(),
  ]);

  // Step 2: Import data in bulk
  // bulkAdd is much faster than adding one-by-one
  // It preserves the original IDs from the export
  await Promise.all([
    db.campaigns.bulkAdd(data.campaigns),
    db.characters.bulkAdd(data.characters),
    db.monsters.bulkAdd(data.monsters),
    db.npcs.bulkAdd(data.npcs),
    db.magic_items.bulkAdd(data.magic_items || []), // Default to empty array for backwards compatibility
    db.encounters.bulkAdd(data.encounters),
    db.sessions.bulkAdd(data.sessions),
  ]);
}

/**
 * Download full database export as JSON file
 * 
 * Triggers a browser download of all campaign data.
 * File naming format: dm-tool-backup-YYYY-MM-DD.json
 * 
 * How it works:
 * 1. Export database to JSON object
 * 2. Create a Blob (file-like object) from JSON string
 * 3. Create a temporary download link
 * 4. Trigger click programmatically
 * 5. Clean up temporary objects
 */
export async function downloadExport(): Promise<void> {
  const exportData = await exportDatabase();
  
  // Create a Blob (binary large object) from the JSON
  // Pretty-print with 2-space indent for human readability
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  
  // Create a temporary URL pointing to the Blob
  const url = URL.createObjectURL(blob);
  
  // Create an invisible <a> tag to trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = `dm-tool-backup-${new Date().toISOString().split("T")[0]}.json`;
  
  // Trigger download
  document.body.appendChild(a);
  a.click();
  
  // Clean up temporary elements and URLs
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download single campaign export as JSON file
 * 
 * Triggers a browser download of one campaign's data.
 * File naming format: campaign-campaign-name-YYYY-MM-DD.json
 * 
 * @param campaignId - The ID of the campaign to export
 * @param campaignName - The name of the campaign (used in filename)
 */
export async function downloadCampaignExport(campaignId: number, campaignName: string): Promise<void> {
  const exportData = await exportCampaign(campaignId);
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  
  // Sanitize campaign name for filesystem
  // Replace any non-alphanumeric characters with hyphens
  const safeName = campaignName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  a.download = `campaign-${safeName}-${new Date().toISOString().split("T")[0]}.json`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import database from uploaded JSON file
 * 
 * Reads a file from user's filesystem and imports the data.
 * **WARNING: This deletes all existing data!**
 * 
 * Validation performed:
 * - Checks for version field
 * - Checks for campaigns array
 * - Throws error if format is invalid
 * 
 * @param file - The File object from an <input type="file">
 * @throws Error if file format is invalid or parsing fails
 */
export async function uploadImport(file: File): Promise<void> {
  // Read file as text
  const text = await file.text();
  
  // Parse JSON (this can throw if invalid JSON)
  const data = JSON.parse(text) as DatabaseExport;
  
  // Basic validation to ensure it's a valid export file
  if (!data.version || !data.campaigns || !Array.isArray(data.campaigns)) {
    throw new Error("Invalid export file format");
  }

  // Import the data (clears existing data!)
  await importDatabase(data);
}
