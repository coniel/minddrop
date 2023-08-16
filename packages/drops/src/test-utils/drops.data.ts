import { Markdown } from '@minddrop/markdown';
import { Drop } from '../types';

export const drop1Markdown = '### Drop 1 title\n\nDrop 1 text';
export const drop2Markdown = '### Drop 2 title\n\nDrop 2 text';

export const drop1Mdast = Markdown.parse(drop1Markdown);
export const drop2Mdast = Markdown.parse(drop2Markdown);

export const drop1: Drop = {
  id: 'drop-1',
  type: 'text',
  markdown: drop1Markdown,
  children: drop1Mdast,
};

export const drop2: Drop = {
  id: 'drop-2',
  type: 'text',
  markdown: drop2Markdown,
  children: drop2Mdast,
};
