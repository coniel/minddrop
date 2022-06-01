import { Core } from '@minddrop/core';
import { RTElements } from '@minddrop/rich-text';
import { HeadingOneElementConfig } from '../../HeadingOneElement';
import { ParagraphElementConfig } from '../../ParagraphElement';
import { ToDoElementConfig } from '../../ToDoElement';

const configs = [
  HeadingOneElementConfig,
  ParagraphElementConfig,
  ToDoElementConfig,
];

/**
 * Registers all default rich text element types.
 */
export function registerDefaultRTElementTypes(core: Core): void {
  configs.forEach((config) => {
    RTElements.register(core, config);
  });
}
