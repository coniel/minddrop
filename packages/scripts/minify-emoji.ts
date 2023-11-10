import fs from 'fs';

interface EmojiJsonItem {
  char: string;
  name: string;
  group: string;
  subgroup: string;
}

// [emoji char, name, group & subgroup indexes, skin tone variant chars]
type Emoji = [string, string, [number, number], string[]?];

/**
 * Used to minify JSON file containing emoji with associated metadata
 * into a version containing as little text as possible.
 *
 * Emoji JSON taken from:
 * https://github.com/amio/emoji.json#readme
 */

// Exclude emoji which aren't yet fully supported
const exclude = [
  'head shaking',
  'walking facing right',
  'kneeling facing right',
  'with white cane facing right',
  'motorized wheelchair facing right',
  'manual wheelchair facing right',
  'running facing right',
  'adult, child',
  'lime',
];

const emojiJsonPath = 'emoji.json';

const emojiJsonFile = fs.readFileSync(emojiJsonPath) as unknown as string;
const emojiFileSize = fs.statSync(emojiJsonPath).size;
const rawEmojiJson = JSON.parse(emojiJsonFile) as EmojiJsonItem[];
const emojiJson: EmojiJsonItem[] = [];

rawEmojiJson.forEach((emojiItem) => {
  // Many emoji have duplicates with the same name.
  // Don't include duplicates.
  if (emojiJson.find((existing) => existing.name === emojiItem.name)) {
    return;
  }

  emojiJson.push(emojiItem);
});

const minifiedEmojiList: Emoji[] = [];
const groups: string[] = [];
const subgroups: string[] = [];

const skinToneComponents = [
  ' light skin tone',
  ' medium-light skin tone',
  ' medium skin tone',
  ' medium-dark skin tone',
  ' dark skin tone',
];

function isSupported(emojiItem: EmojiJsonItem) {
  return !exclude.some((nameSegment) => emojiItem.name.includes(nameSegment));
}

function containsSkinTone(name: string) {
  return name.includes('skin tone');
}

function containsSingleSkinTone(emojiItem: EmojiJsonItem) {
  return emojiItem.name.split(',').filter(containsSkinTone).length === 1;
}

function isNotComponent(emojiItem: EmojiJsonItem) {
  return emojiItem.group !== 'Component';
}

const skinToneMap: Record<string, Record<number, string>> = {};

emojiJson
  .filter(containsSingleSkinTone)
  .filter(isSupported)
  .filter(isNotComponent)
  .forEach((emojiItem) => {
    let skinTone = 0;

    skinToneComponents.forEach((skinToneExtension, index) => {
      if (emojiItem.name.includes(skinToneExtension)) {
        skinTone = index + 1;
      }
    });

    if (!skinTone) {
      return;
    }

    const nameParts = emojiItem.name.split(':');
    const nameBase = nameParts[0];
    const nameComponents = (nameParts[1] || '')
      .split(', ')
      .filter((component) => !component.includes('skin tone'))
      .join(', ');
    const emojiName = nameComponents
      ? `${nameBase}: ${nameComponents.trimStart()}`
      : nameBase;

    if (!skinToneMap[emojiName]) {
      skinToneMap[emojiName] = {};
    }

    skinToneMap[emojiName][skinTone] = emojiItem.char;
  });

emojiJson
  .filter((emojiItem) => !containsSingleSkinTone(emojiItem))
  .filter(isSupported)
  .filter(isNotComponent)
  .forEach((emojiItem) => {
    // Add group to the group list if not present
    if (!groups.includes(emojiItem.group)) {
      groups.push(emojiItem.group);
    }

    // Add subgroup to the subgroup list if not present
    if (!subgroups.includes(emojiItem.subgroup)) {
      subgroups.push(emojiItem.subgroup);
    }

    let emojiName = emojiItem.name;

    const emoji: Emoji = [
      emojiItem.char,
      emojiName,
      [groups.indexOf(emojiItem.group), subgroups.indexOf(emojiItem.subgroup)],
    ];

    if (skinToneMap[emojiItem.name]) {
      const skinToneVariants = Object.keys(skinToneMap[emojiItem.name])
        .sort()
        .map(
          (skinTone) =>
            skinToneMap[emojiItem.name][skinTone as unknown as number],
        );
      emoji.push(skinToneVariants);
    }

    minifiedEmojiList.push(emoji);
  });

const minified = {
  groups,
  subgroups,
  emoji: minifiedEmojiList,
};

// Write the minified file
const outputPath = '../ui/src/EmojiPicker/emoji.min.json';
const stringified = JSON.stringify(minified);

fs.writeFileSync(outputPath, stringified);

// Let's see how much we saved
const minifiedFileSize = fs.statSync(outputPath).size;

console.log(`original: ${Math.round(emojiFileSize / 1024)} KB`);
console.log(`minified: ${Math.round(minifiedFileSize / 1024)} KB`);
console.log(
  `saved:    ${Math.round((emojiFileSize - minifiedFileSize) / 1024)} KB`,
);
