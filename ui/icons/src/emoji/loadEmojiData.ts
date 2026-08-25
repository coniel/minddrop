import { EmojiData, MinifiedEmojiData } from '../types';
import {
  buildEmojiLabelIndex,
  groupByGroup,
  searchEmoji,
  unminifyEmoji,
} from './utils';

// The in-flight or resolved load, so the data is only loaded and
// unminified once
let loadPromise: Promise<EmojiData> | null = null;

// The loaded data, for synchronous access once resolved
let loadedData: EmojiData | null = null;

/**
 * Loads the emoji data, running the load on the first call and
 * reusing the result afterwards.
 *
 * @returns The emoji data.
 */
export function loadEmojiData(): Promise<EmojiData> {
  // Reuse the in-flight or resolved load
  if (!loadPromise) {
    loadPromise = load();
  }

  return loadPromise;
}

/**
 * Returns the loaded emoji data, or null if it has not finished
 * loading.
 */
export function getLoadedEmojiData(): EmojiData | null {
  return loadedData;
}

/**
 * Loads and unminifies the emoji data table.
 */
async function load(): Promise<EmojiData> {
  // Load the raw emoji table
  const emojiData = (await import('./emoji.min.json'))
    .default as unknown as MinifiedEmojiData;

  // Unminify the emoji entries
  const all = emojiData.emoji.map((minifiedEmoji) =>
    unminifyEmoji(minifiedEmoji, emojiData.groups, emojiData.subgroups),
  );

  // Build the label index used for searching
  const { labels, labelToEmoji } = buildEmojiLabelIndex(all);

  const data: EmojiData = {
    all,
    // Pre-group the full table so consumers do not recompute it
    grouped: groupByGroup(all),
    search: (query: string) => searchEmoji(all, labels, labelToEmoji, query),
  };

  // Record the data for synchronous access
  loadedData = data;

  return data;
}
