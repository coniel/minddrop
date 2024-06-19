import { HeadingOneElementConfig } from './HeadingElement';
import { ParagraphElementConfig } from './ParagraphElement';
import { ToDoElementConfig } from './ToDoElement';
import { UnorderedListItemElementConfig } from './UnorderedListItemElement';

export * from './HeadingElement';
export * from './ParagraphElement';
export * from './ToDoElement';
export * from './UnorderedListItemElement';

export const defaultElementConfigs = [
  HeadingOneElementConfig,
  ParagraphElementConfig,
  ToDoElementConfig,
  UnorderedListItemElementConfig,
];
