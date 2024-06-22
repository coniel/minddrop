import { Fs } from '@minddrop/file-system';
import { UserIconType } from '@minddrop/icons';
import { DefaultDocumentIcon } from '../constants';
import { Document } from '../types';

export const parentDir = 'Users/foo/Documents/Workspace';

export const document1: Document = {
  path: Fs.concatPath(parentDir, 'Document 1.md'),
  title: 'Document 1',
  icon: { type: UserIconType.ContentIcon, icon: 'cat', color: 'cyan' },
  wrapped: false,
  contentRaw: `# Document 1

`,
  contentParsed: null,
};

export const document1FileContent = `---
icon: content-icon:cat:cyan
---

# Document 1

`;

export const wrappedDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 2.md'),
  title: 'Document 2',
  wrapped: true,
  icon: DefaultDocumentIcon,
  contentRaw: '# Document 2',
  contentParsed: null,
};

export const childDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 3.md'),
  title: 'Document 3',
  wrapped: false,
  icon: DefaultDocumentIcon,
  contentRaw: '# Document 3',
  contentParsed: null,
};

export const wrappedChildDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 4', 'Document 4.md'),
  title: 'Document 4',
  wrapped: true,
  icon: DefaultDocumentIcon,
  contentRaw: '# Document 4',
  contentParsed: null,
};

export const grandChildDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 4', 'Document 5.md'),
  title: 'Document 5',
  wrapped: false,
  icon: DefaultDocumentIcon,
  contentRaw: '# Document 5',
  contentParsed: null,
};

export const documents = [
  document1,
  wrappedDocument,
  childDocument,
  wrappedChildDocument,
  grandChildDocument,
];
