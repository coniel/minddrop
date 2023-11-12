import { ContentIconName } from '@minddrop/icons';

// [name, category indexes, label indexes]
export type MinifiedContentIcon = [ContentIconName, number[], number[]];

export interface UnminifiedContentIcon {
  name: ContentIconName;
  categories: string[];
  labels: string[];
}
