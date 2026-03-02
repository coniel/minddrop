export type EmojiSkinTone = 0 | 1 | 2 | 3 | 4 | 5;

// [emoji char, name, [group index, subgroup index], skin tone variants]
export type MinifiedEmoji = [string, string, [number, number], string[]?];

export type EmojiItem = {
  char: string;
  name: string;
  group: string;
  labels: string[];
  skinToneVariants?: string[];
};

export interface MinifiedEmojiData {
  groups: string[];
  subgroups: string[];
  emoji: MinifiedEmoji[];
}
