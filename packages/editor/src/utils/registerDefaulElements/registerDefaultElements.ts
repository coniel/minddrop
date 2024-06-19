import {
  HeadingOneElementConfig,
  ParagraphElementConfig,
  ToDoElementConfig,
  UnorderedListItemElementConfig,
} from '../../default-element-configs';
import { registerElementConfig } from '../../registerElementConfig';

const configs = [
  HeadingOneElementConfig,
  ParagraphElementConfig,
  ToDoElementConfig,
  UnorderedListItemElementConfig,
];

/**
 * Registers all default Element types.
 */
export function registerDefaultElements(): void {
  configs.forEach((config) => {
    registerElementConfig(config);
  });
}
