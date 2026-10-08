/**
 * Runs the bun-side database load and background sync against a copy of
 * a workspace on the real file system and SQLite, and reports the sync
 * invariants.
 *
 * The source workspace is copied into a fresh run directory and never
 * touched. The adapters the desktop app registers in its bun process
 * are registered against the copy, with `electrobun/bun` replaced by a
 * stub pointing the app data directory into the run directory.
 *
 * Usage:
 *   bun dev/scripts/hostile-workspace-harness.ts <workspace> [--out <dir>]
 *     [--label <name>] [--index-from <run dir>] [--json]
 *
 * `--index-from` copies the app data, and so the SQL index, of a previous
 * run. The run then starts from an existing index rather than rebuilding
 * it. `--json` prints the report as JSON.
 *
 * Reports the phase run times, the file reads per phase, the entries
 * indexed, and these invariant breaks:
 * - entry files on disk with no entry in the index;
 * - database configs on disk with no database in the index;
 * - indexed entries which vanished or changed ID during the run;
 * - files in the workspace created, modified or deleted during the run.
 */
import { CryptoHasher } from 'bun';
import { Database as SqliteDatabase } from 'bun:sqlite';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createElectrobunStub } from '../../apps/desktop-electrobun/src/bun/test-utils/createElectrobunStub';
import { registerElectrobunStubPlugin } from '../../apps/desktop-electrobun/src/bun/test-utils/registerElectrobunStubPlugin';
import { waitForCondition } from '../../apps/desktop-electrobun/src/bun/test-utils/waitForCondition';
import type * as DatabasesPackage from '../../packages/databases/src';
import type * as DatabaseUtilsModule from '../../packages/databases/src/utils';
import type * as FileSystemPackage from '../../packages/file-system/src';
import type * as UtilsPackage from '../../packages/utils/src';

// The repository's root directory
const REPO_ROOT = path.resolve(import.meta.dir, '../..');
// The desktop app's bun process source directory
const APP_BUN_DIR = path.join(REPO_ROOT, 'apps/desktop-electrobun/src/bun');
// The directory runs are written to when no --out is given
const DEFAULT_OUT_DIR = path.join(
  os.tmpdir(),
  'minddrop-hostile-workspace-harness',
);

type Phase = 'initializeBackend' | 'backgroundSync';

// The phases in the order they run and are reported
const PHASES: Phase[] = ['initializeBackend', 'backgroundSync'];

type FileCategory = 'entry' | 'sidecar' | 'databaseConfig' | 'other';

/**
 * The packages the harness uses, resolved from the desktop app. They are
 * the instances the app's adapters are registered on.
 */
interface AppModules {
  Fs: typeof FileSystemPackage.Fs;
  BaseDirectory: typeof FileSystemPackage.BaseDirectory;
  Databases: typeof DatabasesPackage.Databases;
  DatabaseUtils: typeof DatabaseUtilsModule;
  Utils: typeof UtilsPackage;
}

interface HarnessOptions {
  source: string;
  outDir: string;
  label: string;
  indexFrom: string | null;
  json: boolean;
}

interface IndexedEntry {
  id: string;
  databaseId: string;
  path: string;
}

interface IndexedDatabase {
  id: string;
  path: string;
}

interface IndexSnapshot {
  databases: IndexedDatabase[];
  entries: IndexedEntry[];
}

interface PhaseStats {
  durationMs: number;
  reads: Record<FileCategory, number>;
  distinctEntryFilesRead: number;
  writes: string[];
  removals: string[];
  error: string | null;
}

interface HarnessReport {
  source: string;
  runDir: string;
  workspaceId: string;
  startedFromIndex: boolean;
  schemaChanged: boolean | null;
  phases: Record<Phase, PhaseStats>;
  changeset: {
    upsertedDatabases: number;
    deletedDatabaseIds: string[];
    upsertedEntries: number;
    deletedEntryIds: string[];
  } | null;
  indexedBefore: { databases: number; entries: number };
  indexedAfter: { databases: number; entries: number };
  entryFilesOnDisk: number;
  entryFilesMissingFromIndex: string[];
  databaseConfigsMissingFromIndex: string[];
  vanishedEntries: IndexedEntry[];
  entriesWithChangedId: { path: string; before: string; after: string }[];
  fileChanges: UtilsPackage.SnapshotDiff;
  consoleErrors: string[];
}

// Per-path read counts for the phase in progress
let readCounts = new Map<string, number>();
// Paths written and removed in the phase in progress
let writtenPaths: string[] = [];
let removedPaths: string[] = [];

// Parse the options and run the harness
const options = parseOptions(process.argv.slice(2));
const report = await runHarness(options);

// Print the report
printReport(report, options.json);

/**
 * Copies the workspace, runs the backend load and background sync
 * against the copy, and checks the invariants.
 *
 * @param harnessOptions - The parsed command line options.
 * @returns The run's report.
 */
async function runHarness(
  harnessOptions: HarnessOptions,
): Promise<HarnessReport> {
  // Resolve the run directory and the workspace and app data paths in it
  const runDir = path.join(
    harnessOptions.outDir,
    `${new Date().toISOString().replace(/[:.]/g, '-')}-${harnessOptions.label}`,
  );
  const workspacePath = path.join(runDir, 'workspace');
  const appDataPath = path.join(runDir, 'appdata');

  // Copy the workspace, and the previous run's app data if given
  await fsp.mkdir(runDir, { recursive: true });
  await fsp.cp(harnessOptions.source, workspacePath, {
    recursive: true,
    preserveTimestamps: true,
    verbatimSymlinks: true,
  });

  if (harnessOptions.indexFrom) {
    await fsp.cp(path.join(harnessOptions.indexFrom, 'appdata'), appDataPath, {
      recursive: true,
    });
  }

  // Read the workspace ID and create its data directory
  const workspaceId = readWorkspaceId(workspacePath);
  const dataDirPath = path.join(
    appDataPath,
    'MindDrop/workspaces',
    workspaceId,
  );
  const sqlPath = path.join(dataDirPath, 'data.db');

  await fsp.mkdir(dataDirPath, { recursive: true });

  // Record the workspace's files and the index before the run
  const filesBefore = await hashWorkspaceFiles(workspacePath);
  const indexBefore = readIndex(sqlPath);

  // Collect console errors. Silent failures end up there.
  const consoleErrors = captureConsoleErrors();

  // Stub Electrobun with the base directories inside the run directory
  registerElectrobunStubPlugin(createElectrobunStub(runDir));

  // Load the packages from the desktop app
  const modules = await loadAppModules();
  const { Fs, Databases, DatabaseUtils, Utils } = modules;

  // Register the app's bun-side adapters against the copy
  await registerAdapters(modules, appDataPath);

  // Run the backend load, then the background sync
  const initializePhase = await runPhase(Fs, () =>
    Databases.initializeBackend(workspaceId, workspacePath),
  );
  const syncPhase = await runPhase(Fs, () =>
    Databases.backgroundSync(workspaceId, workspacePath),
  );

  // Record the workspace's files and the index after the run
  const filesAfter = await hashWorkspaceFiles(workspacePath);
  const indexAfter = readIndex(sqlPath);

  // List the entry files and database configs on disk
  const databases = initializePhase.result?.databases ?? [];
  const entryFilesOnDisk = await listEntryFilesOnDisk(
    databases,
    workspacePath,
    DatabaseUtils,
  );
  const databaseConfigsOnDisk = Object.keys(filesAfter)
    .filter((file) =>
      DatabaseUtils.isDatabaseConfigFilePath(path.join(workspacePath, file)),
    )
    .map((file) => path.dirname(path.dirname(file)));
  // Resolve the metadata directory of each database. It has the
  // database's sidecars.
  const metadataDirPaths = databases.map((database) =>
    DatabaseUtils.resolveDatabaseMetadataDirPath(
      path.join(workspacePath, database.path),
    ),
  );
  // Categorize the files read by the entry files and metadata directories
  const entryPaths = new Set(entryFilesOnDisk.map((file) => file.absolutePath));
  const categorizeRead = (filePath: string) =>
    categorizeFile(filePath, entryPaths, metadataDirPaths, DatabaseUtils);

  // Check the index against the disk
  const indexedEntryKeys = new Set(
    indexAfter.entries.map((entry) => `${entry.databaseId}/${entry.path}`),
  );
  const indexedDatabasePaths = new Set(
    indexAfter.databases.map((database) => database.path),
  );
  const entryFilesMissingFromIndex = entryFilesOnDisk
    .filter((file) => !indexedEntryKeys.has(`${file.databaseId}/${file.path}`))
    .map((file) => path.join(file.databasePath, file.path));
  const databaseConfigsMissingFromIndex = databaseConfigsOnDisk.filter(
    (databasePath) => !indexedDatabasePaths.has(databasePath),
  );

  // Check the index before the run against the index after it
  const afterById = new Map(
    indexAfter.entries.map((entry) => [entry.id, entry]),
  );
  const afterByPath = new Map(
    indexAfter.entries.map((entry) => [
      `${entry.databaseId}/${entry.path}`,
      entry,
    ]),
  );
  const vanishedEntries = indexBefore.entries.filter(
    (entry) => !afterById.has(entry.id),
  );
  const entriesWithChangedId = indexBefore.entries.flatMap((entry) => {
    const after = afterByPath.get(`${entry.databaseId}/${entry.path}`);

    // Skip entries no longer at their path or with an unchanged ID
    if (!after || after.id === entry.id) {
      return [];
    }

    return [{ path: entry.path, before: entry.id, after: after.id }];
  });

  // Assemble the report
  const changeset = syncPhase.result;

  return {
    source: harnessOptions.source,
    runDir,
    workspaceId,
    startedFromIndex: indexBefore.entries.length > 0,
    schemaChanged: initializePhase.result?.schemaChanged ?? null,
    phases: {
      initializeBackend: summarizePhase(initializePhase, categorizeRead),
      backgroundSync: summarizePhase(syncPhase, categorizeRead),
    },
    changeset: changeset
      ? {
          upsertedDatabases: changeset.upsertedDatabases.length,
          deletedDatabaseIds: changeset.deletedDatabaseIds,
          upsertedEntries: changeset.upsertedEntries.length,
          deletedEntryIds: changeset.deletedEntryIds,
        }
      : null,
    indexedBefore: {
      databases: indexBefore.databases.length,
      entries: indexBefore.entries.length,
    },
    indexedAfter: {
      databases: indexAfter.databases.length,
      entries: indexAfter.entries.length,
    },
    entryFilesOnDisk: entryFilesOnDisk.length,
    entryFilesMissingFromIndex,
    databaseConfigsMissingFromIndex,
    vanishedEntries,
    entriesWithChangedId,
    fileChanges: Utils.diffSnapshots(filesBefore, filesAfter),
    consoleErrors,
  };
}

/**
 * Parses the command line arguments.
 *
 * @param args - The command line arguments.
 * @returns The harness options.
 */
function parseOptions(args: string[]): HarnessOptions {
  // The positional arguments, the flag values and the JSON switch
  const positional: string[] = [];
  const flags = new Map<string, string>();
  let json = false;

  // Sort the arguments into the JSON switch, flags and positional arguments
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
    } else if (argument.startsWith('--')) {
      flags.set(argument.slice(2), args[index + 1]);
      index += 1;
    } else {
      positional.push(argument);
    }
  }

  // Print the usage and exit if no workspace is given
  if (!positional[0]) {
    console.error(
      'Usage: bun dev/scripts/hostile-workspace-harness.ts <workspace> [--out <dir>] [--label <name>] [--index-from <run dir>] [--json]',
    );
    process.exit(1);
  }

  // Resolve the paths, falling back to the defaults
  const indexFrom = flags.get('index-from');

  return {
    source: path.resolve(positional[0]),
    outDir: path.resolve(flags.get('out') ?? DEFAULT_OUT_DIR),
    label: flags.get('label') ?? 'run',
    indexFrom: indexFrom ? path.resolve(indexFrom) : null,
    json,
  };
}

/**
 * Reads a workspace's ID from its config file.
 *
 * @param workspacePath - The workspace's path.
 * @returns The workspace's ID.
 */
function readWorkspaceId(workspacePath: string): string {
  // Read the workspace config
  const config = JSON.parse(
    fs.readFileSync(
      path.join(workspacePath, '.minddrop/workspace.json'),
      'utf8',
    ),
  );

  return config.id;
}

/**
 * Imports the packages the harness uses, resolved from the desktop app.
 * They are the instances the app's adapters are registered on.
 *
 * @returns The packages.
 */
async function loadAppModules(): Promise<AppModules> {
  // Import the file system and databases packages
  const fileSystemPackage: typeof FileSystemPackage = await import(
    Bun.resolveSync('@minddrop/file-system', APP_BUN_DIR)
  );
  const databasesPath = Bun.resolveSync('@minddrop/databases', APP_BUN_DIR);
  const databasesPackage: typeof DatabasesPackage = await import(databasesPath);
  // Import the databases package's path utils from its source directory.
  // The package keeps them internal.
  const DatabaseUtils: typeof DatabaseUtilsModule = await import(
    path.join(path.dirname(databasesPath), 'utils')
  );
  // Import the utils package
  const Utils: typeof UtilsPackage = await import(
    Bun.resolveSync('@minddrop/utils', APP_BUN_DIR)
  );

  return {
    Fs: fileSystemPackage.Fs,
    BaseDirectory: fileSystemPackage.BaseDirectory,
    Databases: databasesPackage.Databases,
    DatabaseUtils,
    Utils,
  };
}

/**
 * Registers the app's bun-side SQL and file system adapters. The file
 * system adapter is wrapped to count reads and record writes.
 *
 * @param modules - The packages resolved from the desktop app.
 * @param appDataPath - The app data directory the stub resolves to.
 * @returns A promise resolving once the base directory paths resolve.
 */
async function registerAdapters(
  modules: AppModules,
  appDataPath: string,
): Promise<void> {
  // Import the app's adapter registrations
  const { Fs, BaseDirectory, Utils } = modules;
  const { initializeSql } = await import(path.join(APP_BUN_DIR, 'sql'));
  const { registerBunFileSystemAdapter } = await import(
    path.join(APP_BUN_DIR, 'search/registerFileSystemAdapter')
  );

  // Wrap the adapter the app registers with the counters
  const registerAdapter = Fs.registerAdapter;

  Fs.registerAdapter = (adapter, registerOptions) =>
    registerAdapter(countAdapterCalls(adapter, Utils), registerOptions);

  // Register the adapters
  initializeSql();
  registerBunFileSystemAdapter();

  // Restore the original registration
  Fs.registerAdapter = registerAdapter;

  // Wait for the base directory paths to resolve. Registration does not
  // await them.
  const appDataDirPath = path.join(appDataPath, 'MindDrop');

  await waitForCondition(
    () => Fs.resolveBaseDirPath(BaseDirectory.AppData) === appDataDirPath,
  );
}

/**
 * Wraps a file system adapter to count reads per path and record
 * writes and removals.
 *
 * @param adapter - The adapter to wrap.
 * @param Utils - The utils package resolved from the desktop app.
 * @returns The wrapped adapter.
 */
function countAdapterCalls(
  adapter: FileSystemPackage.FileSystemAdapter,
  Utils: typeof UtilsPackage,
): FileSystemPackage.FileSystemAdapter {
  return {
    // The adapter's other methods, unwrapped
    ...adapter,
    // Count each read path
    readTextFile: (filePath, readOptions) => {
      Utils.incrementMapCount(readCounts, filePath);

      return adapter.readTextFile(filePath, readOptions);
    },
    // Count each path in a batch read
    readTextFiles: (paths, readOptions) => {
      paths.forEach((filePath) =>
        Utils.incrementMapCount(readCounts, filePath),
      );

      return adapter.readTextFiles(paths, readOptions);
    },
    // Record each written path
    writeTextFile: (filePath, contents, writeOptions) => {
      writtenPaths.push(filePath);

      return adapter.writeTextFile(filePath, contents, writeOptions);
    },
    // Record each path in a batch write
    writeTextFiles: (entries, writeOptions) => {
      writtenPaths.push(...entries.map((entry) => entry.path));

      return adapter.writeTextFiles(entries, writeOptions);
    },
    // Record each removed path
    removeFile: (filePath, removeOptions) => {
      removedPaths.push(filePath);

      return adapter.removeFile(filePath, removeOptions);
    },
  };
}

/**
 * Runs one phase and collects its duration and file system calls. A
 * thrown error is recorded rather than ending the run.
 *
 * @param Fs - The file system API resolved from the desktop app.
 * @param operation - The phase's operation.
 * @returns The phase's result, duration, file system calls and error.
 */
async function runPhase<TResult>(
  Fs: typeof FileSystemPackage.Fs,
  operation: () => Promise<TResult>,
): Promise<{
  result: TResult | null;
  durationMs: number;
  reads: Map<string, number>;
  writes: string[];
  removals: string[];
  error: string | null;
}> {
  // Reset the phase's file system call records
  readCounts = new Map();
  writtenPaths = [];
  removedPaths = [];

  // Start the timer
  const start = performance.now();
  let result: TResult | null = null;
  let error: string | null = null;

  // Run the operation, recording a thrown error
  try {
    result = await operation();
  } catch (thrown) {
    error =
      thrown instanceof Error
        ? (thrown.stack ?? thrown.message)
        : String(thrown);
  }

  // Wait for the writes the phase queued
  await Fs.tests.awaitAllOperations();

  return {
    result,
    durationMs: performance.now() - start,
    reads: readCounts,
    writes: writtenPaths,
    removals: removedPaths,
    error,
  };
}

/**
 * Summarizes a phase's file system calls by file category.
 *
 * @param phase - The phase's run.
 * @param categorize - Returns the category of a file read.
 * @returns The phase's stats.
 */
function summarizePhase(
  phase: Awaited<ReturnType<typeof runPhase>>,
  categorize: (filePath: string) => FileCategory,
): PhaseStats {
  // Start each category's read count at zero
  const reads: Record<FileCategory, number> = {
    entry: 0,
    sidecar: 0,
    databaseConfig: 0,
    other: 0,
  };
  let distinctEntryFilesRead = 0;

  // Add each path's reads to its category's count
  phase.reads.forEach((count, filePath) => {
    const category = categorize(filePath);

    reads[category] += count;

    // Count each entry file once
    if (category === 'entry') {
      distinctEntryFilesRead += 1;
    }
  });

  return {
    durationMs: Math.round(phase.durationMs),
    reads,
    distinctEntryFilesRead,
    writes: phase.writes,
    removals: phase.removals,
    error: phase.error,
  };
}

/**
 * Returns the category of a file read.
 *
 * @param filePath - The path of the file read.
 * @param entryPaths - The paths of the entry files on disk.
 * @param metadataDirPaths - The databases' metadata directory paths.
 * @param DatabaseUtils - The databases package's path utils.
 * @returns The file's category.
 */
function categorizeFile(
  filePath: string,
  entryPaths: Set<string>,
  metadataDirPaths: string[],
  DatabaseUtils: typeof DatabaseUtilsModule,
): FileCategory {
  // Check if the file is an entry file
  if (entryPaths.has(filePath)) {
    return 'entry';
  }

  // Check if the file is a database config
  if (DatabaseUtils.isDatabaseConfigFilePath(filePath)) {
    return 'databaseConfig';
  }

  // Check if the file is in a metadata directory. If so, it is a sidecar.
  if (
    metadataDirPaths.some((metadataDirPath) =>
      filePath.startsWith(`${metadataDirPath}/`),
    )
  ) {
    return 'sidecar';
  }

  return 'other';
}

/**
 * Lists the entry files on disk of each database. They are read directly
 * from the file system rather than through the adapters under test.
 *
 * @param databases - The databases to list the entry files of.
 * @param workspacePath - The workspace's path.
 * @param DatabaseUtils - The databases package's path utils.
 * @returns The entry files on disk.
 */
async function listEntryFilesOnDisk(
  databases: DatabasesPackage.Database[],
  workspacePath: string,
  DatabaseUtils: typeof DatabaseUtilsModule,
): Promise<
  {
    databaseId: string;
    databasePath: string;
    path: string;
    absolutePath: string;
  }[]
> {
  const files = await Promise.all(
    databases.map(async (database) => {
      // Read every path in the database directory
      const databasePath = path.join(workspacePath, database.path);
      const relativePaths = (
        await fsp.readdir(databasePath, { recursive: true })
      ).map(String);

      // Filter for entry files
      return relativePaths
        .filter((relativePath) =>
          DatabaseUtils.isEntryFilePath(relativePath, database),
        )
        .map((relativePath) => ({
          databaseId: database.id,
          databasePath: database.path,
          path: relativePath,
          absolutePath: path.join(databasePath, relativePath),
        }));
    }),
  );

  // Merge the databases' entry files into one list
  return files.flat();
}

/**
 * Reads the databases and entries in the SQL index. The index is opened
 * read only and separately from the adapter under test.
 *
 * @param sqlPath - The SQL index file's path.
 * @returns The indexed databases and entries.
 */
function readIndex(sqlPath: string): IndexSnapshot {
  // Return an empty snapshot if there is no index file
  if (!fs.existsSync(sqlPath)) {
    return { databases: [], entries: [] };
  }

  // Open the index read only
  const database = new SqliteDatabase(sqlPath, { readonly: true });

  // Read the databases and entries
  try {
    return {
      databases: database
        .query<IndexedDatabase, []>('SELECT id, path FROM databases')
        .all(),
      entries: database
        .query<
          IndexedEntry,
          []
        >('SELECT id, database_id AS databaseId, path FROM entries')
        .all(),
    };
  } catch (error) {
    // Return an empty snapshot if the file has no tables yet
    if (error instanceof Error && error.message.includes('no such table')) {
      return { databases: [], entries: [] };
    }

    // Rethrow any other error
    throw error;
  } finally {
    // Close the index
    database.close();
  }
}

/**
 * Hashes every file in the workspace, keyed by its path relative to
 * the workspace.
 *
 * @param workspacePath - The workspace's path.
 * @returns The file hashes keyed by relative path.
 */
async function hashWorkspaceFiles(
  workspacePath: string,
): Promise<Record<string, string>> {
  // Read every path in the workspace
  const hashes: Record<string, string> = {};
  const relativePaths = await fsp.readdir(workspacePath, { recursive: true });

  // Hash each file
  await Promise.all(
    relativePaths.map(async (relativePath) => {
      const absolutePath = path.join(workspacePath, String(relativePath));
      const stats = await fsp.lstat(absolutePath);

      // Skip directories and symlinks
      if (!stats.isFile()) {
        return;
      }

      // Hash the file's contents, marking it unreadable if the read fails
      try {
        const hasher = new CryptoHasher('sha1');

        hasher.update(await fsp.readFile(absolutePath));
        hashes[String(relativePath)] = hasher.digest('hex');
      } catch {
        hashes[String(relativePath)] = 'unreadable';
      }
    }),
  );

  return hashes;
}

/**
 * Records `console.error` calls. The calls still reach the console.
 *
 * @returns The recorded errors, added to as they are logged.
 */
function captureConsoleErrors(): string[] {
  // The recorded errors and the original console.error
  const errors: string[] = [];
  const consoleError = console.error;

  // Record each call, then pass it on
  console.error = (...args: unknown[]) => {
    errors.push(args.map(formatConsoleArgument).join(' '));
    consoleError(...args);
  };

  return errors;
}

/**
 * Formats a console argument as a single line.
 *
 * @param argument - The console argument.
 * @returns The formatted argument.
 */
function formatConsoleArgument(argument: unknown): string {
  // Format errors by name and message
  if (argument instanceof Error) {
    return `${argument.name}: ${argument.message}`;
  }

  // Leave strings as they are
  if (typeof argument === 'string') {
    return argument;
  }

  // Serialize anything else as JSON
  return JSON.stringify(argument);
}

/**
 * Prints the report, as JSON or as a readable summary.
 *
 * @param harnessReport - The run's report.
 * @param json - Whether to print the report as JSON.
 */
function printReport(harnessReport: HarnessReport, json: boolean): void {
  // Print the report as JSON if requested
  if (json) {
    console.log(JSON.stringify(harnessReport, null, 2));

    return;
  }

  // Add the run's source and start state
  const lines = [
    `Source:      ${harnessReport.source}`,
    `Run dir:     ${harnessReport.runDir}`,
    `Start:       ${harnessReport.startedFromIndex ? 'from an existing index' : 'empty index'} (schemaChanged: ${harnessReport.schemaChanged})`,
    '',
  ];

  // Add each phase's stats
  PHASES.forEach((phase) => {
    const stats = harnessReport.phases[phase];

    lines.push(
      `${phase}: ${stats.durationMs} ms`,
      `  reads: entry ${stats.reads.entry} (${stats.distinctEntryFilesRead} distinct), sidecar ${stats.reads.sidecar}, database config ${stats.reads.databaseConfig}, other ${stats.reads.other}`,
      `  writes: ${stats.writes.length}, removals: ${stats.removals.length}`,
    );

    // Add the phase's error, if it threw
    if (stats.error) {
      lines.push(`  THREW: ${stats.error}`);
    }
  });

  // Add the changeset, the index counts and the invariant breaks
  const changeset = harnessReport.changeset;

  lines.push(
    '',
    `Sync changeset: ${changeset ? `${changeset.upsertedDatabases} databases upserted, ${changeset.deletedDatabaseIds.length} deleted, ${changeset.upsertedEntries} entries upserted, ${changeset.deletedEntryIds.length} deleted` : 'none'}`,
    `Index before: ${harnessReport.indexedBefore.databases} databases, ${harnessReport.indexedBefore.entries} entries`,
    `Index after:  ${harnessReport.indexedAfter.databases} databases, ${harnessReport.indexedAfter.entries} entries`,
    `Entry files on disk: ${harnessReport.entryFilesOnDisk}`,
    '',
    'Invariants:',
    ...formatList(
      'entry files missing from the index',
      harnessReport.entryFilesMissingFromIndex,
    ),
    ...formatList(
      'database configs missing from the index',
      harnessReport.databaseConfigsMissingFromIndex,
    ),
    ...formatList(
      'indexed entries which vanished',
      harnessReport.vanishedEntries.map(
        (entry) => `${entry.path} (${entry.id})`,
      ),
    ),
    ...formatList(
      'entries whose ID changed',
      harnessReport.entriesWithChangedId.map(
        (entry) => `${entry.path}: ${entry.before} -> ${entry.after}`,
      ),
    ),
    ...formatList('files created', harnessReport.fileChanges.created),
    ...formatList('files modified', harnessReport.fileChanges.modified),
    ...formatList('files deleted', harnessReport.fileChanges.deleted),
    ...formatList('console errors', harnessReport.consoleErrors),
  );

  // Print the summary
  console.log(lines.join('\n'));
}

/**
 * Formats a labelled list, truncated to its first twenty items.
 *
 * @param label - The list's label.
 * @param items - The list's items.
 * @returns The formatted lines.
 */
function formatList(label: string, items: string[]): string[] {
  // Indent the first twenty items
  const shown = items.slice(0, 20).map((item) => `    ${item}`);
  // Count the items left out
  const more =
    items.length > 20 ? [`    ... and ${items.length - 20} more`] : [];

  return [`  ${label}: ${items.length}`, ...shown, ...more];
}
