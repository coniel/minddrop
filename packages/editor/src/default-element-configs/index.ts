import { HeadingOneElementConfig } from './HeadingOneElement';
import { HeadingThreeElementConfig } from './HeadingThreeElement';
import { HeadingTwoElementConfig } from './HeadingTwoElement';
import { ParagraphElementConfig } from './ParagraphElement';
import { ToDoElementConfig } from './ToDoElement';

export type { ToDoElement } from './ToDoElement';
export type { BookmarkElement } from './BookmarkElement';
export type { ImageElement } from './ImageElement';
export type { FileElement } from './FileElement';

export * from './HeadingOneElement';
export * from './HeadingTwoElement';
export * from './HeadingThreeElement';
export * from './ParagraphElement';
export * from './ToDoElement';

export const defaultElementConfigs = [
  HeadingOneElementConfig,
  HeadingTwoElementConfig,
  HeadingThreeElementConfig,
  ParagraphElementConfig,
  ToDoElementConfig,
];
