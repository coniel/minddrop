import { htmlToMarkdown } from './htmlToMarkdown';
import { mdastNodesToMarkdown } from './mdastNodesToMarkdown';
import { parseMarkdown } from './parseMarkdown';
import { parseMarkdownFile } from './parseMarkdownFile';
import { MarkdownApi } from './types/MarkdownApi';
import { updateMarkdownFileHeading } from './updateMarkdownFileHeading';
import { updateMarkdownHeading } from './updateMarkdownHeading';
import { writeMarkdownFile } from './writeMarkdownFile';

export const Markdown: MarkdownApi = {
  parse: parseMarkdown,
  fromMdast: mdastNodesToMarkdown,
  fromHtml: htmlToMarkdown,
  updateHeading: updateMarkdownHeading,
  parseFile: parseMarkdownFile,
  writeFile: writeMarkdownFile,
  updateFileHeading: updateMarkdownFileHeading,
};
