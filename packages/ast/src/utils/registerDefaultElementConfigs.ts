import {
  BookmarkElementConfig,
  HeadingElementConfig,
  ToDoElementConfig,
  FileElementConfig,
  HorizontalRuleElementConfig,
  ParagraphElementConfig,
  UnorderedListItemElementConfig,
  parseBookmarkElementFromMarkdown,
  parseFileElementFromMarkdown,
  parseHeadingElementFromMarkdown,
  parseHorizontalRuleElementFromMarkdown,
  parseParagraphElementFromMarkdown,
  parseToDoElementFromMarkdown,
  parseUnorderedListItemElementFromMarkdown,
} from '../element-configs';
import { MarkdownLineParsersStore } from '../MarkdownLineParsersStore';
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

  const markdownLineParsers = [
    parseHeadingElementFromMarkdown,
    parseBookmarkElementFromMarkdown,
    parseToDoElementFromMarkdown,
    parseFileElementFromMarkdown,
    parseHorizontalRuleElementFromMarkdown,
    parseUnorderedListItemElementFromMarkdown,
    parseParagraphElementFromMarkdown,
  ];

  // Register all default element configs
  configs.forEach((config) => {
    registerElementTypeConfig(config);
  });

  // Register all default markdown line parsers
  markdownLineParsers.forEach((parser) => {
    MarkdownLineParsersStore.add(parser);
  });
}
