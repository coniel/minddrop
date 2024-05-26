import { HeadingOneElementConfig } from '../../default-element-configs/HeadingOneElement';
import { ParagraphElementConfig } from '../../default-element-configs/ParagraphElement';
import { ToDoElementConfig } from '../../default-element-configs/ToDoElement';
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
