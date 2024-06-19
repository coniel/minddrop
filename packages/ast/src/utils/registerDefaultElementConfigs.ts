import {
  BookmarkElementConfig,
  HeadingElementConfig,
  ToDoElementConfig,
  FileElementConfig,
  HorizontalRuleElementConfig,
  ParagraphElementConfig,
  UnorderedListItemElementConfig,
} from '../block-element-configs';
import { registerBlockElementConfig } from '../registerBlockElementConfig';

/**
 * Registers all default block and inline markdown element configs.
 */
export function registerDefaultElementConfigs() {
  const blockElementConfigs = [
    HeadingElementConfig,
    BookmarkElementConfig,
    ToDoElementConfig,
    FileElementConfig,
    HorizontalRuleElementConfig,
    UnorderedListItemElementConfig,
    // Register the paragraph element config last so that acts as a fallback
    ParagraphElementConfig,
  ];

  // Register all default markdown block element configs
  blockElementConfigs.forEach((config) => {
    registerBlockElementConfig(config);
  });
}
