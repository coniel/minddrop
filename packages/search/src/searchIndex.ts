import MiniSearch, { type Options as MiniSearchOptions } from 'minisearch';
import { Databases } from '@minddrop/databases';
import { Fs } from '@minddrop/file-system';
import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from './constants';
import { getSearchConfigPath } from './searchIndexConfig';
import type { FullTextMatchedProperty, FullTextSearchResult } from './types';

interface SearchDocument {
  id: string;
  type: 'entry' | 'database';
  title: string;
  databaseId: string;
  databaseName: string;
  databaseIcon: string;
  content: string;
  properties: string;
  tags: string;
}

// Per-workspace MiniSearch instances
const indexes = new Map<string, MiniSearch<SearchDocument>>();

// Per-workspace persist timers for debounced saves
const persistTimers = new Map<string, ReturnType<typeof setTimeout>>();

// Debounce delay for persisting the index to disk (ms)
const PERSIST_DEBOUNCE_MS = 5000;

/**
 * Returns the file path for the persisted MiniSearch index.
 */
function getIndexPath(workspaceId: string): string {
  return `${getSearchConfigPath()}/${workspaceId}/search-index.json`;
}

// Shared MiniSearch configuration used for both creating new
// instances and loading persisted ones
const MINISEARCH_OPTIONS: MiniSearchOptions<SearchDocument> = {
  fields: ['title', 'content', 'properties', 'tags'],
  storeFields: ['type', 'databaseId', 'databaseName', 'databaseIcon', 'title'],
  searchOptions: {
    boost: { title: 2, tags: 2, properties: 1.5 },
    fuzzy: (term: string) => {
      if (term.length <= 2) {
        return 0;
      }

      if (term.length <= 5) {
        return 1;
      }

      return 2;
    },
    prefix: true,
    boostDocument: (_id, _term, storedFields) =>
      storedFields?.type === 'database' ? 1.5 : 1,
  },
};

/**
 * Creates a new MiniSearch instance with the standard configuration.
 */
function createMiniSearch(): MiniSearch<SearchDocument> {
  return new MiniSearch<SearchDocument>(MINISEARCH_OPTIONS);
}

/**
 * Initializes the MiniSearch index for a workspace. Loads from
 * disk if a persisted index exists and its version matches the
 * SQL database version. Otherwise, rebuilds from SQL data.
 */
export async function initializeSearchIndex(
  workspaceId: string,
): Promise<void> {
  const currentVersion = Databases.sql.getVersion();
  const indexPath = getIndexPath(workspaceId);

  // Try loading persisted index
  try {
    const raw = await Fs.readTextFile(indexPath);
    const persisted = JSON.parse(raw) as {
      version: number;
      index: object;
    };

    // Validate the version matches
    if (persisted.version === currentVersion) {
      const miniSearch = MiniSearch.loadJSON<SearchDocument>(
        JSON.stringify(persisted.index),
        MINISEARCH_OPTIONS,
      );

      indexes.set(workspaceId, miniSearch);
      console.log(
        `[search] Loaded persisted index for workspace ${workspaceId} (version ${currentVersion})`,
      );

      return;
    }

    console.log(
      `[search] Index version mismatch (persisted: ${persisted.version}, current: ${currentVersion}), rebuilding`,
    );
  } catch {
    // No persisted index or parse error, rebuild
    console.log(
      `[search] No persisted index found for workspace ${workspaceId}, building from scratch`,
    );
  }

  // Build from SQL data
  await rebuildSearchIndex(workspaceId);
}

/**
 * Rebuilds the MiniSearch index from SQL data for the
 * specified workspace.
 */
export async function rebuildSearchIndex(workspaceId: string): Promise<void> {
  const miniSearch = createMiniSearch();
  const entries = Databases.sql.getAllEntries();

  // Build entry documents from SQL data
  const entryDocuments: SearchDocument[] = entries.map((entry) => {
    const { textValues, propertyValues } = Databases.sql.getEntryTextContent(
      entry.id,
    );

    const databaseName = Databases.sql.getDatabaseName(entry.databaseId) ?? '';
    const databaseIcon = Databases.sql.getDatabaseIcon(entry.databaseId);

    return {
      id: entry.id,
      type: 'entry' as const,
      title: entry.title,
      databaseId: entry.databaseId,
      databaseName,
      databaseIcon,
      content: textValues.join(' '),
      properties: propertyValues.join(' '),
      tags: '',
    };
  });

  // Build database documents
  const databases = Databases.sql.getAllDatabases();
  const databaseDocuments: SearchDocument[] = databases.map((database) => ({
    id: `db:${database.id}`,
    type: 'database' as const,
    title: database.name,
    databaseId: database.id,
    databaseName: database.name,
    databaseIcon: database.icon,
    content: '',
    properties: '',
    tags: '',
  }));

  // Bulk-add all documents
  miniSearch.addAll([...entryDocuments, ...databaseDocuments]);
  indexes.set(workspaceId, miniSearch);

  console.log(
    `[search] Built index for workspace ${workspaceId} with ${entryDocuments.length} entries and ${databaseDocuments.length} databases`,
  );

  // Persist to disk
  await persistIndex(workspaceId);
}

/**
 * Performs a full-text fuzzy search across the workspace index.
 */
export function searchFullTextIndex(
  workspaceId: string,
  query: string,
  limit = 20,
  databaseId?: string,
): FullTextSearchResult[] {
  const miniSearch = indexes.get(workspaceId);

  if (!miniSearch) {
    return [];
  }

  const results = miniSearch.search(query, {
    filter: databaseId
      ? (result) => result.databaseId === databaseId
      : undefined,
  });

  // Lowercase query terms for substring matching
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);

  return results.slice(0, limit).map((result) => {
    const type = result.type as 'entry' | 'database';
    const entryId =
      type === 'database'
        ? (result.id as string).replace(/^db:/, '')
        : (result.id as string);

    // Find matching properties for entry results
    let matchedProperties: FullTextMatchedProperty[] = [];

    if (type === 'entry') {
      matchedProperties = findMatchedProperties(
        result.id as string,
        queryTerms,
      );
    }

    // Add highlight markers to entry titles
    let title = result.title as string;

    if (type === 'entry') {
      title = highlightAllMatches(title, queryTerms);
    }

    return {
      id: entryId,
      type,
      databaseId: result.databaseId as string,
      databaseName: result.databaseName as string,
      databaseIcon: (result.databaseIcon as string) || '',
      title,
      score: result.score,
      matchedProperties,
    };
  });
}

/**
 * Updates the MiniSearch index after entries are upserted.
 * Removes existing documents and re-adds them with fresh data.
 */
export function upsertIndexEntries(
  entries: {
    id: string;
    title: string;
    databaseId: string;
  }[],
): void {
  // Use the first workspace index
  const workspaceId = indexes.keys().next().value;

  if (!workspaceId) {
    return;
  }

  const miniSearch = indexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  for (const entry of entries) {
    // Remove existing document if present
    try {
      miniSearch.discard(entry.id);
    } catch {
      // Document did not exist, that is fine
    }

    // Build the updated document
    const { textValues, propertyValues } = Databases.sql.getEntryTextContent(
      entry.id,
    );

    const databaseName = Databases.sql.getDatabaseName(entry.databaseId) ?? '';
    const databaseIcon = Databases.sql.getDatabaseIcon(entry.databaseId);

    miniSearch.add({
      id: entry.id,
      type: 'entry',
      title: entry.title,
      databaseId: entry.databaseId,
      databaseName,
      databaseIcon,
      content: textValues.join(' '),
      properties: propertyValues.join(' '),
      tags: '',
    });
  }

  // Debounced persist
  debouncedPersist(workspaceId);
}

/**
 * Updates or adds a database document in the MiniSearch index.
 */
export function upsertIndexDatabase(database: {
  id: string;
  name: string;
  icon?: string;
}): void {
  // Use the first workspace index
  const workspaceId = indexes.keys().next().value;

  if (!workspaceId) {
    return;
  }

  const miniSearch = indexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  // Remove existing document if present
  const docId = `db:${database.id}`;

  try {
    miniSearch.discard(docId);
  } catch {
    // Document did not exist
  }

  miniSearch.add({
    id: docId,
    type: 'database',
    title: database.name,
    databaseId: database.id,
    databaseName: database.name,
    databaseIcon: database.icon || '',
    content: '',
    properties: '',
    tags: '',
  });

  debouncedPersist(workspaceId);
}

/**
 * Removes a database document from the MiniSearch index.
 */
export function removeIndexDatabase(databaseId: string): void {
  // Use the first workspace index
  const workspaceId = indexes.keys().next().value;

  if (!workspaceId) {
    return;
  }

  const miniSearch = indexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  try {
    miniSearch.discard(`db:${databaseId}`);
  } catch {
    // Document did not exist
  }

  debouncedPersist(workspaceId);
}

/**
 * Removes entries from the MiniSearch index.
 */
export function removeIndexEntries(entryIds: string[]): void {
  // Use the first workspace index
  const workspaceId = indexes.keys().next().value;

  if (!workspaceId) {
    return;
  }

  const miniSearch = indexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  for (const id of entryIds) {
    try {
      miniSearch.discard(id);
    } catch {
      // Document did not exist
    }
  }

  // Debounced persist
  debouncedPersist(workspaceId);
}

/**
 * Re-indexes all entries belonging to a database in the
 * MiniSearch index. Used when database metadata changes
 * (name, icon) or when the property schema changes.
 */
export function reindexDatabaseEntries(databaseId: string): void {
  // Use the first workspace index
  const workspaceId = indexes.keys().next().value;

  if (!workspaceId) {
    return;
  }

  const miniSearch = indexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  // Get all entries for this database from SQL
  const entries = Databases.sql
    .getAllEntries()
    .filter((entry) => entry.databaseId === databaseId);

  // Get fresh database metadata
  const databaseName = Databases.sql.getDatabaseName(databaseId) ?? '';
  const databaseIcon = Databases.sql.getDatabaseIcon(databaseId);

  // Remove and re-add each entry document
  for (const entry of entries) {
    try {
      miniSearch.discard(entry.id);
    } catch {
      // Document did not exist
    }

    const { textValues, propertyValues } = Databases.sql.getEntryTextContent(
      entry.id,
    );

    miniSearch.add({
      id: entry.id,
      type: 'entry',
      title: entry.title,
      databaseId,
      databaseName,
      databaseIcon,
      content: textValues.join(' '),
      properties: propertyValues.join(' '),
      tags: '',
    });
  }

  debouncedPersist(workspaceId);
}

// Property types that contain long-form text and should
// be returned as snippets rather than full values
const LONG_TEXT_TYPES = new Set(['text', 'formatted-text']);

// Number of words to show before and after the matched term
const SNIPPET_CONTEXT_WORDS = 5;

// Maximum value length (in characters) before snippeting kicks in
const SNIPPET_THRESHOLD = 80;

/**
 * Finds which properties on an entry match the search query
 * terms via case-insensitive substring matching. Returns at
 * most one match per property name. For long text properties,
 * returns a snippet with highlight markers around the match.
 */
function findMatchedProperties(
  entryId: string,
  queryTerms: string[],
): FullTextMatchedProperty[] {
  const propertyValues = Databases.sql.getEntryPropertyValues(entryId);

  // Group matched values by property name so multi-value
  // properties (select, collection) show all matching values
  const matchesByName = new Map<string, { type: string; values: string[] }>();

  for (const property of propertyValues) {
    const lowerValue = property.value.toLowerCase();

    // Find all query terms that match this property value
    const matchingTerms = queryTerms.filter((term) =>
      lowerValue.includes(term),
    );

    if (matchingTerms.length === 0) {
      continue;
    }

    let value: string;

    // For long text properties, extract a snippet around the first match
    if (
      LONG_TEXT_TYPES.has(property.type) &&
      property.value.length > SNIPPET_THRESHOLD
    ) {
      value = extractSnippet(property.value, matchingTerms);
    } else {
      value = highlightAllMatches(property.value, matchingTerms);
    }

    const existing = matchesByName.get(property.name);

    if (existing) {
      existing.values.push(value);
    } else {
      matchesByName.set(property.name, {
        type: property.type,
        values: [value],
      });
    }
  }

  // Build the result, joining multiple values with a comma
  const matched: FullTextMatchedProperty[] = [];

  for (const [name, { type, values }] of matchesByName) {
    matched.push({ name, type, value: values.join(', ') });
  }

  return matched;
}

/**
 * Extracts a snippet of text around the first occurrence of
 * the matched term, with a few words of context on each side.
 * Wraps the matched portion in highlight markers.
 */
function extractSnippet(text: string, terms: string[]): string {
  const lowerText = text.toLowerCase();

  // Find the position of the first matching term for snippet centering
  const matchIndex = terms.reduce((earliest, term) => {
    const index = lowerText.indexOf(term);

    if (index === -1) {
      return earliest;
    }

    return earliest === -1 ? index : Math.min(earliest, index);
  }, -1);

  if (matchIndex === -1) {
    return text;
  }

  // Split the full text into words, tracking each word's
  // start position so we can find which word contains the match
  const words: { word: string; start: number }[] = [];
  const wordPattern = /\S+/g;
  let wordMatch: RegExpExecArray | null;

  while ((wordMatch = wordPattern.exec(text)) !== null) {
    words.push({ word: wordMatch[0], start: wordMatch.index });
  }

  // Find the word index that contains the match start position
  let matchWordIndex = 0;

  for (let i = 0; i < words.length; i++) {
    if (words[i].start + words[i].word.length > matchIndex) {
      matchWordIndex = i;
      break;
    }
  }

  // Calculate the window of words to include
  const windowStart = Math.max(0, matchWordIndex - SNIPPET_CONTEXT_WORDS);
  const windowEnd = Math.min(
    words.length,
    matchWordIndex + SNIPPET_CONTEXT_WORDS + 1,
  );

  // Build the snippet from the word window
  const snippetWords = words
    .slice(windowStart, windowEnd)
    .map((entry) => entry.word);
  const snippet = snippetWords.join(' ');

  // Highlight all matching terms within the snippet
  return highlightAllMatches(snippet, terms);
}

/**
 * Wraps all occurrences of all matching terms in highlight
 * markers. Builds a single regex from all terms to avoid
 * double-highlighting overlapping matches.
 */
function highlightAllMatches(text: string, terms: string[]): string {
  if (terms.length === 0) {
    return text;
  }

  // Sort terms by length descending so longer terms match first
  const sorted = [...terms].sort((a, b) => b.length - a.length);

  const escaped = sorted.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');

  return text.replace(
    pattern,
    `${MATCH_HIGHLIGHT_START}$1${MATCH_HIGHLIGHT_END}`,
  );
}

/**
 * Persists the MiniSearch index to disk along with the current
 * SQL version for validation on reload.
 */
export async function persistIndex(workspaceId: string): Promise<void> {
  const miniSearch = indexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  const version = Databases.sql.getVersion();
  const data = JSON.stringify({
    version,
    index: miniSearch.toJSON(),
  });

  const indexPath = getIndexPath(workspaceId);

  // Ensure the directory exists
  const dirPath = indexPath.replace(/\/[^/]+$/, '');
  await Fs.ensureDir(dirPath);

  // Write the index file
  await Fs.writeTextFile(indexPath, data);
}

/**
 * Debounces persisting the index to disk. Waits PERSIST_DEBOUNCE_MS
 * after the last call before actually writing.
 */
function debouncedPersist(workspaceId: string): void {
  const existingTimer = persistTimers.get(workspaceId);

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(() => {
    persistIndex(workspaceId);
    persistTimers.delete(workspaceId);
  }, PERSIST_DEBOUNCE_MS);

  persistTimers.set(workspaceId, timer);
}
