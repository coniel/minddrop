import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { BackgroundSyncChangeset, Database } from '@minddrop/databases';
import { Databases } from '@minddrop/databases';
import { BaseDirectory, Fs } from '@minddrop/file-system';
import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import { createBunSqlAdapter } from '../../sql/bunSqlAdapter';
import { mockElectrobun } from '../../test-utils/mockElectrobun';
import { waitForCondition } from '../../test-utils/waitForCondition';
import {
  handleDatabasesInitialize,
  handleDatabasesSyncDatabaseConfigs,
  setSyncChangesetSender,
} from './databasesRpc';

mockElectrobun();

const { registerBunFileSystemAdapter } = await import(
  '../../search/registerFileSystemAdapter'
);

// The ID of the workspace the tests index
const workspaceId = 'workspace_databases-rpc';

// A database config as stored in its database.json file
const storedDatabase = {
  id: 'database_books',
  entryName: 'Book',
  properties: [],
  entrySerializer: 'markdown',
  icon: 'lucide:book:blue',
  entryOpenMode: 'dialog',
  propertyFileStorage: 'property',
  created: '2024-01-01T00:00:00.000Z',
  lastModified: '2024-01-01T00:00:00.000Z',
  colorProperty: null,
  views: [],
  designs: [],
  entryTemplates: [],
};

describe('databasesRpc', () => {
  // The temporary workspace directory
  let workspacePath: string;
  // The path to the database's config file
  let configPath: string;
  // The databases as loaded on initialization
  let databases: Database[];
  // The changesets sent to the webview
  let sentChangesets: BackgroundSyncChangeset[];

  beforeEach(async () => {
    // Register the platform adapters, as the Bun process does
    Sql.registerAdapter(createBunSqlAdapter());
    registerBunFileSystemAdapter();

    // Wait for the base directory paths to resolve. The SQL index is
    // stored in the app data directory.
    await waitForCondition(() =>
      Boolean(Fs.resolveBaseDirPath(BaseDirectory.AppData)),
    );

    // Create the workspace directory
    workspacePath = await fsp.mkdtemp(
      path.join(os.tmpdir(), 'minddrop-databases-rpc-'),
    );
    // Resolve the database's config file path
    configPath = path.join(
      workspacePath,
      'Books',
      '.minddrop',
      'database.json',
    );

    // Write the database's config file
    await writeConfig(storedDatabase);

    // Index the workspace
    ({ databases } = await handleDatabasesInitialize({
      workspaceId,
      workspacePath,
    }));

    // Collect the changesets sent to the webview
    sentChangesets = [];
    setSyncChangesetSender((changeset) => sentChangesets.push(changeset));
  });

  afterEach(async () => {
    // Close the index
    Sql.close(workspaceId);

    // Remove the index
    await fsp.rm(Workspaces.resolveDataDirPath(workspaceId), {
      recursive: true,
      force: true,
    });

    // Remove the workspace
    await fsp.rm(workspacePath, { recursive: true, force: true });
  });

  describe('handleDatabasesSyncDatabaseConfigs', () => {
    it('indexes an icon changed on disk and sends the changeset', async () => {
      // Edit the database's icon outside of the app
      await writeConfig({ ...storedDatabase, icon: 'lucide:book:red' });

      // Sync the database's config
      await handleDatabasesSyncDatabaseConfigs({
        workspaceId,
        workspacePath,
        databases,
        databaseIds: [storedDatabase.id],
      });

      expect(indexedIcon()).toBe('lucide:book:red');
      expect(
        sentChangesets.map((changeset) =>
          changeset.upsertedDatabases.map((database) => database.icon),
        ),
      ).toEqual([['lucide:book:red']]);
    });

    it('sends no changeset when no config could be synced', async () => {
      // Make the config unparseable outside of the app
      await fsp.writeFile(configPath, '{ not json');

      // Sync the database's config
      await handleDatabasesSyncDatabaseConfigs({
        workspaceId,
        workspacePath,
        databases,
        databaseIds: [storedDatabase.id],
      });

      expect(indexedIcon()).toBe(storedDatabase.icon);
      expect(sentChangesets).toEqual([]);
    });
  });

  /**
   * Writes the database's config file.
   *
   * @param config - The config to write.
   */
  async function writeConfig(config: typeof storedDatabase): Promise<void> {
    // Ensure the config's directory exists
    await fsp.mkdir(path.dirname(configPath), { recursive: true });

    // Write the config file
    await fsp.writeFile(configPath, JSON.stringify(config));
  }
});

/**
 * Returns the database's indexed icon.
 *
 * @returns The icon on the database's SQL record.
 */
function indexedIcon(): string | undefined {
  return Databases.sql
    .getAllDatabases(workspaceId)
    .find((record) => record.id === storedDatabase.id)?.icon;
}
