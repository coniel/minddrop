import { Fs } from '@minddrop/file-system';
import { UserIconType } from '@minddrop/icons';
import { DefaultPageIcon } from '../constants';
import { Page } from '../types';

export const parentDir = 'Users/foo/Documents/Workspace';

export const page1: Page = {
  path: Fs.concatPath(parentDir, 'Page 1.md'),
  title: 'Page 1',
  icon: { type: UserIconType.ContentIcon, icon: 'cat', color: 'cyan' },
  wrapped: false,
  contentRaw: `# Page 1

`,
  contentParsed: null,
};

export const page1FileContent = `---
icon: content-icon:cat:cyan
---

# Page 1

`;

export const wrappedPage: Page = {
  path: Fs.concatPath(parentDir, 'Page 2', 'Page 2.md'),
  title: 'Page 2',
  wrapped: true,
  icon: DefaultPageIcon,
  contentRaw: '# Page 2',
  contentParsed: null,
};

export const childPage: Page = {
  path: Fs.concatPath(parentDir, 'Page 2', 'Page 3.md'),
  title: 'Page 3',
  wrapped: false,
  icon: DefaultPageIcon,
  contentRaw: '# Page 3',
  contentParsed: null,
};

export const wrappedChildPage: Page = {
  path: Fs.concatPath(parentDir, 'Page 2', 'Page 4', 'Page 4.md'),
  title: 'Page 4',
  wrapped: true,
  icon: DefaultPageIcon,
  contentRaw: '# Page 4',
  contentParsed: null,
};

export const grandChildPage: Page = {
  path: Fs.concatPath(parentDir, 'Page 2', 'Page 4', 'Page 5.md'),
  title: 'Page 5',
  wrapped: false,
  icon: DefaultPageIcon,
  contentRaw: '# Page 5',
  contentParsed: null,
};

export const pages = [
  page1,
  wrappedPage,
  childPage,
  wrappedChildPage,
  grandChildPage,
];
