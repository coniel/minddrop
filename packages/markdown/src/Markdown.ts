import { parseMarkdown } from './parseMarkdown';
import { parseMarkdownFile } from './parseMarkdownFile';
import { tokensToMarkdown } from './tokensToMarkdown';
import { MarkdownApi } from './types/MarkdownApi';
import { updateMarkdownFileHeading } from './updateMarkdownFileHeading';
import { updateMarkdownHeading } from './updateMarkdownHeading';
import { writeMarkdownFile } from './writeMarkdownFile';

export const Markdown: MarkdownApi = {
  parse: parseMarkdown,
  toMarkdown: tokensToMarkdown,
  updateHeading: updateMarkdownHeading,
  parseFile: parseMarkdownFile,
  writeFile: writeMarkdownFile,
  updateFileHeading: updateMarkdownFileHeading,
};
