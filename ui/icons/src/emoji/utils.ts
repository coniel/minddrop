import { fuzzySearch } from '@minddrop/utils';
import { EmojiItem, EmojiSkinTone, MinifiedEmoji } from './Emoji.types';

/**
 * Converts minified emoji data into an emoji object.
 * Adds icon name, group, and subgroup to labels to
 * make them searchable.
 */
export const unminifyEmoji = (
  minifiedEmoji: MinifiedEmoji,
  groups: string[],
  subgroups: string[],
): EmojiItem => ({
  char: minifiedEmoji[0],
  name: minifiedEmoji[1],
  group: groups[minifiedEmoji[2][0]],
  labels: [
    minifiedEmoji[1],
    groups[minifiedEmoji[2][0]],
    subgroups[minifiedEmoji[2][1]],
  ],
  skinToneVariants: minifiedEmoji[3] || undefined,
});

/**
 * Returns the specified skin tone variant of an emoji char if
 * it exists or the original if not.
 */
export function getSkinToneVariant(emoji: EmojiItem, skinTone: EmojiSkinTone) {
  if (emoji.skinToneVariants) {
    return emoji.skinToneVariants[skinTone - 1] || emoji.char;
  }

  return emoji.char;
}

/**
 * Groups emoji into [group, Emoji[]] tuples.
 */
export function groupByGroup(emojis: EmojiItem[]): [string, EmojiItem[]][] {
  return emojis.reduce<[string, EmojiItem[]][]>((list, emoji) => {
    const groupIndex = list.findIndex(([group]) => group === emoji.group);

    if (groupIndex === -1) {
      list.push([emoji.group, [emoji]]);
    } else {
      list[groupIndex][1].push(emoji);
    }

    return list;
  }, []);
}

/**
 * Extracts all unique labels from all emoji and builds
 * a label-to-emoji index for O(1) lookups during search.
 */
export function buildEmojiLabelIndex(emojis: EmojiItem[]) {
  const labelSet = new Set<string>();
  const labelToEmoji = new Map<string, EmojiItem[]>();

  for (const emoji of emojis) {
    for (const label of emoji.labels) {
      labelSet.add(label);

      let items = labelToEmoji.get(label);

      if (!items) {
        items = [];
        labelToEmoji.set(label, items);
      }

      items.push(emoji);
    }
  }

  return { labels: Array.from(labelSet), labelToEmoji };
}

/**
 * Filters emoji based on a fuzzy search matching
 * their labels. Uses a pre-built label index for
 * fast lookups.
 */
export function searchEmoji(
  emojis: EmojiItem[],
  labels: string[],
  labelToEmoji: Map<string, EmojiItem[]>,
  query: string,
) {
  const matchedLabels = fuzzySearch(labels, query);

  // If there is no query or a single character query
  // has no results, return everything
  if (!query || (query.length === 1 && !matchedLabels.length)) {
    return emojis;
  }

  const results = new Set<EmojiItem>();

  // Look up each matched label in the pre-built index
  for (const label of matchedLabels) {
    const items = labelToEmoji.get(label);

    if (items) {
      for (const emoji of items) {
        results.add(emoji);
      }
    }
  }

  return Array.from(results);
}
