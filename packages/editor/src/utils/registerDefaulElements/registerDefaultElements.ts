import {
  HeadingOneElementConfig,
  ParagraphElementConfig,
  ToDoElementConfig,
} from '../../default-element-configs';
import { registerElementConfig } from '../../registerElementConfig';

const configs = [
  HeadingOneElementConfig,
  ParagraphElementConfig,
  ToDoElementConfig,
];

/**
 * Registers all default Element types.
 */
export function registerDefaultElements(): void {
  configs.forEach((config) => {
    registerElementConfig(config);
  });
}
