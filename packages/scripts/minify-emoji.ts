import fs from 'fs';

interface EmojiJsonItem {
  emoji: string;
  description: string;
  category: string;
  aliases: string[];
  tags: string[];
  skin_tones?: boolean;
}

// [emoji, category index, labels, supportsSkinTones]
type Emoji = [string, number, string[], boolean?];

/**
 * Used to minify JSON file containing emoji with associated metadata
 * into a version containing as little text as possible.
 *
 * Emoji JSON file located at:
 * https://github.com/github/gemoji/blob/master/db/emoji.json
 */

const emojiJsonPath = 'emoji.json';

const emojiJsonFile = fs.readFileSync(emojiJsonPath) as unknown as string;
const emojiFileSize = fs.statSync(emojiJsonPath).size;
const emojiJson = JSON.parse(emojiJsonFile) as EmojiJsonItem[];

const minifiedEmojiList: Emoji[] = [];
const categories: string[] = [];

emojiJson.forEach((emojiItem) => {
  // Add category to the { [category]: char } map if not present
  if (!categories.includes(emojiItem.category)) {
    categories.push(emojiItem.category);
  }

  // Combine description, aliases, and tags into a single
  // 'labels' field.
  let dirtyLabels = [
    emojiItem.description,
    ...emojiItem.aliases,
    ...emojiItem.tags,
  ]
    .map((label) => label.toLowerCase())
    .map((label) => label.split('_').join(' '))
    .map((label) => label.split('-').join(' '));

  // Convert to set to remove duplicates
  const uniqueLabels = new Set(dirtyLabels);

  // Some emoji have a description like "right facing fist" and
  // an alias of "right fist", or "arrow up" and "up arrow".
  // We don't need both (reduces file size by ~10%).
  const withoutSimilarAliases: string[][] = [];

  Array.from(uniqueLabels).forEach((label) => {
    let hasMatchingDescription = false;
    const parts = label.split(' ');

    withoutSimilarAliases.forEach((otherParts) => {
      if (parts.every((part) => otherParts.includes(part))) {
        hasMatchingDescription = true;
      }
    });

    if (!hasMatchingDescription) {
      withoutSimilarAliases.push(parts);
    }
  });

  // Join the broken up labels back into strings
  const labels = withoutSimilarAliases
    .map((parts) => parts.join(' '))
    // Remove 'flag: ' prefix from flag emoji labels
    .map((label) => (label.startsWith('flag: ') ? label.slice(6) : label));

  const emoji: Emoji = [
    emojiItem.emoji,
    categories.indexOf(emojiItem.category),
    labels,
  ];

  if (emojiItem.skin_tones) {
    emoji.push(true);
  }

  minifiedEmojiList.push(emoji);
});

const minified = {
  categories,
  emoji: minifiedEmojiList,
};

// Write the minified file
const stringified = JSON.stringify(minified);

fs.writeFileSync('emoji.min.json', stringified);

// Let's see how much we saved
const minifiedFileSize = fs.statSync('emoji.min.json').size;

console.log(`original: ${Math.round(emojiFileSize / 1024)} KB`);
console.log(`minified: ${Math.round(minifiedFileSize / 1024)} KB`);
console.log(
  `saved:    ${Math.round((emojiFileSize - minifiedFileSize) / 1024)} KB`,
);
