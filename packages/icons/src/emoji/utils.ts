import { fuzzySearch } from '@minddrop/utils';
import { EmojiItem, MinifiedEmoji, EmojiSkinTone } from './Emoji.types';

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

// Get all unique labels from all emoji as an array
export const getAllLabels = (emojis: EmojiItem[]) =>
  Array.from(
    new Set(
      emojis.reduce<string[]>((all, emoji) => [...all, ...emoji.labels], []),
    ),
  );

/**
 * Filters emoji based on a fuzzy search matching
 * their labels.
 */
export function searchEmoji(
  emojis: EmojiItem[],
  labels: string[],
  query: string,
) {
  const matchedLabels = fuzzySearch(labels, query);

  // If there is no query or a single character query
  // has no results, return everything.
  if (!query || (query.length === 1 && !matchedLabels.length)) {
    return emojis;
  }

  const results = new Set<EmojiItem>();

  matchedLabels.forEach((label) => {
    // Add all emoji with the matched label to the
    // results set.
    emojis
      .filter((emoji) => emoji.labels.includes(label))
      .forEach((emoji) => results.add(emoji));
  });

  return Array.from(results);
}
