import { Fs } from '@minddrop/file-system';
import { Icons, UserIcon, UserIconType } from '@minddrop/icons';
import { DefaultDocumentIconString } from '../constants';
import { Document, DocumentTypeConfig } from '../types';

export const configDefaultProperties = {
  icon: 'content-icon:cat:cyan',
};
export const configDefaultContent = 'Hello, world!';
export const configDefaultFileTextContent = JSON.stringify({
  properties: configDefaultProperties,
  content: configDefaultContent,
});

export const documentTypeConfig: DocumentTypeConfig = {
  fileType: 'test',
  initialize: () => ({
    properties: configDefaultProperties,
    content: configDefaultContent,
  }),
  parseProperties: (textContent: string) => JSON.parse(textContent).properties,
  parseContent: (textContent: string) => JSON.parse(textContent).content,
  stringify: (properties, content) => JSON.stringify({ properties, content }),
  component: () => null,
};

export const parentDir = 'Users/foo/Documents/Workspace';

export const document1Icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
};

export const document1Content = 'Document 1';
export const document1: Document<string, { customProperty: string }> = {
  path: Fs.concatPath(parentDir, 'Document 1.test'),
  fileType: documentTypeConfig.fileType,
  title: 'Document 1',
  properties: {
    icon: Icons.stringify(document1Icon),
    customProperty: 'foo',
  },
  wrapped: false,
  fileTextContent: `{"properties":{"icon":"content-icon:cat:cyan","customProperty":"foo"},"content":"${document1Content}"}`,
  content: null,
};

export const wrappedDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 2.test'),
  fileType: documentTypeConfig.fileType,
  title: 'Document 2',
  wrapped: true,
  properties: {
    icon: DefaultDocumentIconString,
  },
  fileTextContent: '{"properties":{},"content":"Document 2"}',
  content: null,
};

export const childDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 3.test'),
  fileType: documentTypeConfig.fileType,
  title: 'Document 3',
  wrapped: false,
  properties: {
    icon: DefaultDocumentIconString,
  },
  fileTextContent: '{"properties":{},"content":"Document 3"}',
  content: null,
};

export const wrappedChildDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 4', 'Document 4.test'),
  fileType: documentTypeConfig.fileType,
  title: 'Document 4',
  wrapped: true,
  properties: {
    icon: DefaultDocumentIconString,
  },
  fileTextContent: '{"properties":{},"content":"Document 4"}',
  content: null,
};

export const grandChildDocument: Document = {
  path: Fs.concatPath(parentDir, 'Document 2', 'Document 4', 'Document 5.test'),
  fileType: documentTypeConfig.fileType,
  title: 'Document 5',
  wrapped: false,
  properties: {
    icon: DefaultDocumentIconString,
  },
  fileTextContent: '{"properties":{},"content":"Document 5"}',
  content: null,
};

export const documents = [
  document1,
  wrappedDocument,
  childDocument,
  wrappedChildDocument,
  grandChildDocument,
];
