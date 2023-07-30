import { htmlToMarkdown } from './htmlToMarkdown';
import { isMdastNode } from './isMdastNode';
import { mdastNodesToMarkdown } from './mdastNodesToMarkdown';
import { mdastToString } from './mdastToString';
import { parseMarkdown } from './parseMarkdown';
import { parseMarkdownFile } from './parseMarkdownFile';
import { removeMdastNodes } from './removeMdastNodes';
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
  toString: mdastToString,
  is: isMdastNode,
  remove: removeMdastNodes,
};
