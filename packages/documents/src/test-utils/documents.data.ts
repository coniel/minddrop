import { Fs } from '@minddrop/file-system';
import { Icons, UserIcon, UserIconType } from '@minddrop/icons';
import { DefaultDocumentIconString } from '../constants';
import { Document, PersistedDocumentData, DocumentView } from '../types';
import { serializeDocumentToJsonString } from '../utils';

export const configDefaultProperties = {
  icon: 'content-icon:cat:cyan',
};
export const configDefaultContent = 'Hello, world!';
export const configDefaultFileTextContent = JSON.stringify({
  properties: configDefaultProperties,
  content: configDefaultContent,
});

export const workspaceDir = 'Users/foo/Documents/Workspace';
export const parentWorkspaceId = 'workspace-1';

export const document1Icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
};

export const document2Icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'dog',
  color: 'cyan',
};

export const document1View1: DocumentView = {
  id: 'document-1-view-1',
  type: 'board',
  blocks: [],
};

export const document1View2: DocumentView = {
  id: 'document-1-view-2',
  type: 'page',
  blocks: [],
};

export const document2View: DocumentView = {
  id: 'document-2-view',
  type: 'page',
  blocks: [],
};

export const wrappedDocumentView: DocumentView = {
  id: 'wrtapped-document-view',
  type: 'board',
  blocks: [],
};

export const childDocumentView: DocumentView = {
  id: 'child-document-view',
  type: 'board',
  blocks: [],
};

export const wrappedChildDocumentView: DocumentView = {
  id: 'wrapped-child-document-view',
  type: 'board',
  blocks: [],
};

export const grandchildDocumentView: DocumentView = {
  id: 'grandchild-document-view',
  type: 'board',
  blocks: [],
};

export const document1Data: PersistedDocumentData = {
  id: 'document-1',
  created: new Date(),
  lastModified: new Date(),
  blocks: [],
  views: [document1View1.id, document1View2.id],
  icon: Icons.stringify(document1Icon),
};

/**
 * A workspace level document with no children and two views.
 */
export const document1: Document = {
  ...document1Data,
  path: Fs.concatPath(workspaceDir, 'Document 1.minddrop'),
  title: 'Document 1',
  wrapped: false,
};

export const document2Data: PersistedDocumentData = {
  id: 'document-2',
  created: new Date(),
  lastModified: new Date(),
  blocks: [],
  views: [document1View2.id],
  icon: Icons.stringify(document2Icon),
};

/**
 * A workspace level document with no children and one view.
 */
export const document2: Document = {
  ...document2Data,
  path: Fs.concatPath(workspaceDir, 'Document 2.minddrop'),
  title: 'Document 2',
  wrapped: false,
};

export const wrappedDocumentData: PersistedDocumentData = {
  id: 'wrapped-document',
  created: new Date(),
  lastModified: new Date(),
  blocks: [],
  views: [wrappedDocumentView.id],
  icon: DefaultDocumentIconString,
};

/**
 * A workspace level document with one child (`childDocument`) document and one view.
 */
export const wrappedDocument: Document = {
  ...wrappedDocumentData,
  path: Fs.concatPath(
    workspaceDir,
    'Wrapped document',
    'Wrapped document.minddrop',
  ),
  title: 'Wrapped document',
  wrapped: true,
};

export const childDocumentData: PersistedDocumentData = {
  id: 'child-document',
  created: new Date(),
  lastModified: new Date(),
  blocks: [],
  views: [childDocumentView.id],
  icon: DefaultDocumentIconString,
};

/**
 * A child document of `wrappedDocument` with one view.
 */
export const childDocument: Document = {
  ...childDocumentData,
  path: Fs.concatPath(
    workspaceDir,
    wrappedDocument.title,
    'Child document.minddrop',
  ),
  title: 'Child document',
  wrapped: false,
};

export const wrappedChildDocumentData: PersistedDocumentData = {
  id: 'wrapped-child-document',
  created: new Date(),
  lastModified: new Date(),
  blocks: [],
  views: [wrappedChildDocumentView.id],
  icon: DefaultDocumentIconString,
};

/**
 * A child document of `wrappedDocument` with one child (`grandChildDocument`) document and one view.
 */
export const wrappedChildDocument: Document = {
  ...wrappedChildDocumentData,
  path: Fs.concatPath(
    workspaceDir,
    wrappedDocument.title,
    'Wrapped child document',
    'Wrapped child document.minddrop',
  ),
  title: 'Wrapped child document',
  wrapped: true,
};

export const grandChildDocumentData: PersistedDocumentData = {
  id: 'grand-child-document',
  created: new Date(),
  lastModified: new Date(),
  blocks: [],
  views: [grandchildDocumentView.id],
  icon: DefaultDocumentIconString,
};

/**
 * A child of document `childDocument` with no children and one view.
 */
export const grandChildDocument: Document = {
  ...grandChildDocumentData,
  path: Fs.concatPath(
    workspaceDir,
    wrappedDocument.title,
    wrappedChildDocument.title,
    'Grand child document.minddrop',
  ),
  title: 'Grand child document',
  wrapped: false,
};

export const documentViews = [
  document1View1,
  document1View2,
  document2View,
  wrappedDocumentView,
  childDocumentView,
  wrappedChildDocumentView,
  grandchildDocumentView,
];

export const documents = [
  document1,
  document2,
  wrappedDocument,
  childDocument,
  wrappedChildDocument,
  grandChildDocument,
];

export const documentFiles = documents.map((document) => ({
  path: document.path,
  textContent: serializeDocumentToJsonString(document),
}));
