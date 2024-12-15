import { EditorBlockElementConfigsStore } from '../../BlockElementTypeConfigsStore';
import {
  HeadingOneElementConfig,
  ParagraphElementConfig,
  ToDoElementConfig,
  UnorderedListItemElementConfig,
} from '../../default-element-configs';

const blockElementConfigs = [
  HeadingOneElementConfig,
  ParagraphElementConfig,
  ToDoElementConfig,
  UnorderedListItemElementConfig,
];

/**
 * Registers all default Element types.
 */
export function registerDefaultElements(): void {
  blockElementConfigs.forEach((config) => {
    EditorBlockElementConfigsStore.add(config);
  });
}
