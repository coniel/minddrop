import {
  BookmarkElementConfig,
  HeadingElementConfig,
  ToDoElementConfig,
  FileElementConfig,
  HorizontalRuleElementConfig,
  ParagraphElementConfig,
  UnorderedListItemElementConfig,
} from '../element-configs';
import { registerElementTypeConfig } from '../registerElementTypeConfig';

/**
 * Registers all default block and inline markdown element configs.
 */
export function registerDefaultElementConfigs() {
  const configs = [
    HeadingElementConfig,
    BookmarkElementConfig,
    ToDoElementConfig,
    FileElementConfig,
    HorizontalRuleElementConfig,
    UnorderedListItemElementConfig,
    // Register the paragraph element config last so that acts as a fallback
    ParagraphElementConfig,
  ];

  // Register all default element configs
  configs.forEach((config) => {
    registerElementTypeConfig(config);
  });
}
