import {
  HeadingOneElementConfig,
  HeadingThreeElementConfig,
  HeadingTwoElementConfig,
  ParagraphElementConfig,
  ToDoElementConfig,
} from '../../default-element-configs';
import { registerElementConfig } from '../../registerElementConfig';

const configs = [
  HeadingOneElementConfig,
  HeadingTwoElementConfig,
  HeadingThreeElementConfig,
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
