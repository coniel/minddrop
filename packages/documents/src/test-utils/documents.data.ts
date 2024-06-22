import { Fs } from '@minddrop/file-system';
import { Icons, UserIcon, UserIconType } from '@minddrop/icons';
import { DefaultDocumentIconString } from '../constants';
import { Document } from '../types';

export const parentDir = 'Users/foo/Documents/Workspace';

export const document1Icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
};

export const document1: Document = {
  path: Fs.concatPath(parentDir, 'Document 1.md'),
  title: 'Document 1',
  icon: Icons.stringify(document1Icon),
  wrapped: false,
  fileTextContent: `# Document 1

`,
  content: null,
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
  icon: DefaultDocumentIconString,
  fileTextContent: '# Document 2',
  content: null,
};

export const childDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 3.md'),
  title: 'Document 3',
  wrapped: false,
  icon: DefaultDocumentIconString,
  fileTextContent: '# Document 3',
  content: null,
};

export const wrappedChildDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 4', 'Document 4.md'),
  title: 'Document 4',
  wrapped: true,
  icon: DefaultDocumentIconString,
  fileTextContent: '# Document 4',
  content: null,
};

export const grandChildDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 4', 'Document 5.md'),
  title: 'Document 5',
  wrapped: false,
  icon: DefaultDocumentIconString,
  fileTextContent: '# Document 5',
  content: null,
};

export const documents = [
  document1,
  wrappedDocument,
  childDocument,
  wrappedChildDocument,
  grandChildDocument,
];
