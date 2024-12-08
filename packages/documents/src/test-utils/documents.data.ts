import { Fs } from '@minddrop/file-system';
import { Icons, UserIcon, UserIconType } from '@minddrop/icons';
import { DefaultDocumentIconString } from '../constants';
import {
  Document,
  SerializableDocumentData,
  DocumentView,
  DocumentViewTypeConfig,
} from '../types';
import { Block } from '@minddrop/blocks';

export const workspaceDir = 'Users/foo/Documents/Workspace';
export const parentWorkspaceId = 'workspace-1';

export interface TestDocumentView extends DocumentView {
  blocks: string[];
}

export const boardViewTypeConfig: DocumentViewTypeConfig<TestDocumentView> = {
  id: 'board',
  icon: 'kanban-square',
  component: () => null,
  onRemoveBlocks: (view, blocks) => ({
    ...view,
    blocks: view.blocks.filter((id) => !blocks.find((b) => b.id === id)),
  }),
  onAddBlocks: (view, blocks) => ({
    ...view,
    blocks: view.blocks.concat(blocks.map((b) => b.id)),
  }),
  description: {
    'en-US': {
      name: 'Board',
      details: 'A board view.',
    },
  },
  initialize: () => ({ blocks: [] }),
};

export const pageViewTypeConfig: DocumentViewTypeConfig<TestDocumentView> = {
  ...boardViewTypeConfig,
  id: 'page',
  description: {
    'en-US': {
      name: 'Page',
      details: 'A Page view.',
    },
  },
};

/************************/
/****** Document 1 ******/
/************************/

export const document1Icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
};

export const document1Block1: Block = {
  id: 'block-1',
  type: 'text',
  created: new Date(),
  lastModified: new Date(),
  text: 'Document 1 block 1',
};

export const document1Block2: Block = {
  id: 'block-2',
  type: 'text',
  created: new Date(),
  lastModified: new Date(),
  text: 'Document 1 block 2',
};

export const document1Blocks: Block[] = [document1Block1, document1Block2];
export const document1BlockIds = document1Blocks.map((block) => block.id);

export const document1View1: DocumentView = {
  id: 'document-1-view-1',
  type: boardViewTypeConfig.id,
  blocks: document1BlockIds,
};

export const document1View2: DocumentView = {
  id: 'document-1-view-2',
  type: 'page',
  blocks: [],
};

export const document1Views = [document1View1, document1View2];

/**
 * A workspace level document with no children and two views.
 */
export const document1: Document = {
  id: 'document-1',
  created: new Date(),
  lastModified: new Date(),
  path: Fs.concatPath(workspaceDir, 'Document 1.minddrop'),
  title: 'Document 1',
  icon: Icons.stringify(document1Icon),
  wrapped: false,
  blocks: document1BlockIds,
  views: document1Views.map((view) => view.id),
};

export const document1Data: SerializableDocumentData = {
  id: document1.id,
  created: document1.created,
  lastModified: document1.lastModified,
  title: document1.title,
  icon: document1.icon,
  blocks: document1Blocks,
  views: document1Views,
};

export const document1Serialized = JSON.stringify(document1Data);

/************************/
/****** Document 2 ******/
/************************/

export const document2Icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'dog',
  color: 'cyan',
};

export const document2View: DocumentView = {
  id: 'document-2-view',
  type: 'page',
  blocks: [],
};

/**
 * A workspace level document with no children and one view.
 */
export const document2: Document = {
  id: 'document-2',
  created: new Date(),
  lastModified: new Date(),
  path: Fs.concatPath(workspaceDir, 'Document 2.minddrop'),
  title: 'Document 2',
  icon: Icons.stringify(document2Icon),
  wrapped: false,
  blocks: [],
  views: [document2View.id],
};

export const document2Data: SerializableDocumentData = {
  id: document2.id,
  created: document2.created,
  lastModified: document2.lastModified,
  title: document2.title,
  icon: document2.icon,
  blocks: [],
  views: [document2View],
};

export const document2Serialized = JSON.stringify(document2Data);

/******************************/
/****** Wrapped Document ******/
/******************************/

export const wrappedDocumentView: DocumentView = {
  id: 'wrtapped-document-view',
  type: boardViewTypeConfig.id,
  blocks: [],
};

/**
 * A workspace level document with one child (`childDocument`) document and one view.
 */
export const wrappedDocument: Document = {
  id: 'wrapped-document',
  created: new Date(),
  lastModified: new Date(),
  path: Fs.concatPath(
    workspaceDir,
    'Wrapped document',
    'Wrapped document.minddrop',
  ),
  title: 'Wrapped document',
  icon: DefaultDocumentIconString,
  wrapped: true,
  blocks: [],
  views: [wrappedDocumentView.id],
};

export const wrappedDocumentData: SerializableDocumentData = {
  id: wrappedDocument.id,
  created: wrappedDocument.created,
  lastModified: wrappedDocument.lastModified,
  title: wrappedDocument.title,
  icon: wrappedDocument.icon,
  blocks: [],
  views: [wrappedDocumentView],
};

export const wrappedDocumentSerialized = JSON.stringify(wrappedDocumentData);

/******************************/
/******** Child Document ******/
/******************************/

export const childDocumentView: DocumentView = {
  id: 'child-document-view',
  type: boardViewTypeConfig.id,
  blocks: [],
};

/**
 * A child document of `wrappedDocument` with one view.
 */
export const childDocument: Document = {
  id: 'child-document',
  created: new Date(),
  lastModified: new Date(),
  path: Fs.concatPath(
    workspaceDir,
    wrappedDocument.title,
    'Child document.minddrop',
  ),
  title: 'Child document',
  icon: DefaultDocumentIconString,
  wrapped: false,
  blocks: [],
  views: [childDocumentView.id],
};

export const childDocumentData: SerializableDocumentData = {
  id: childDocument.id,
  created: childDocument.created,
  lastModified: childDocument.lastModified,
  title: childDocument.title,
  icon: childDocument.icon,
  blocks: [],
  views: [childDocumentView],
};

export const childDocumentSerialized = JSON.stringify(childDocumentData);

/************************************/
/****** Wrapped Child Document ******/
/************************************/

export const wrappedChildDocumentView: DocumentView = {
  id: 'wrapped-child-document-view',
  type: boardViewTypeConfig.id,
  blocks: [],
};

/**
 * A child document of `wrappedDocument` with one child (`grandChildDocument`) document and one view.
 */
export const wrappedChildDocument: Document = {
  id: 'wrapped-child-document',
  created: new Date(),
  lastModified: new Date(),
  icon: DefaultDocumentIconString,
  path: Fs.concatPath(
    workspaceDir,
    wrappedDocument.title,
    'Wrapped child document',
    'Wrapped child document.minddrop',
  ),
  title: 'Wrapped child document',
  wrapped: true,
  blocks: [],
  views: [wrappedChildDocumentView.id],
};

export const wrappedChildDocumentData: SerializableDocumentData = {
  id: wrappedChildDocument.id,
  created: wrappedChildDocument.created,
  lastModified: wrappedChildDocument.lastModified,
  title: wrappedChildDocument.title,
  icon: wrappedChildDocument.icon,
  blocks: [],
  views: [wrappedChildDocumentView],
};

export const wrappedChildDocumentSerialized = JSON.stringify(
  wrappedChildDocumentData,
);

/**********************************/
/****** Grand Child Document ******/
/**********************************/

export const grandchildDocumentView: DocumentView = {
  id: 'grandchild-document-view',
  type: boardViewTypeConfig.id,
  blocks: [],
};

/**
 * A child of document `childDocument` with no children and one view.
 */
export const grandChildDocument: Document = {
  id: 'grand-child-document',
  created: new Date(),
  lastModified: new Date(),
  icon: DefaultDocumentIconString,
  path: Fs.concatPath(
    workspaceDir,
    wrappedDocument.title,
    wrappedChildDocument.title,
    'Grand child document.minddrop',
  ),
  title: 'Grand child document',
  wrapped: false,
  blocks: [],
  views: [grandchildDocumentView.id],
};

export const grandChildDocumentData: SerializableDocumentData = {
  id: grandChildDocument.id,
  created: grandChildDocument.created,
  lastModified: grandChildDocument.lastModified,
  title: grandChildDocument.title,
  icon: grandChildDocument.icon,
  blocks: [],
  views: [grandchildDocumentView],
};

export const grandChildDocumentSerialized = JSON.stringify(
  grandChildDocumentData,
);

/*******************/
/** Combined Data **/
/*******************/

export const documentViews = [
  ...document1Views,
  ...document2Data.views,
  ...wrappedDocumentData.views,
  ...childDocumentData.views,
  ...wrappedChildDocumentData.views,
  ...grandChildDocumentData.views,
];

export const documentViewsObject = documentViews.reduce(
  (views, view) => ({
    ...views,
    [view.id]: view,
  }),
  {},
);

export const documentBlocks = [
  ...document1Blocks,
  ...document2Data.blocks,
  ...wrappedDocumentData.blocks,
  ...childDocumentData.blocks,
  ...wrappedChildDocumentData.blocks,
  ...grandChildDocumentData.blocks,
];

export const documents = [
  document1,
  document2,
  wrappedDocument,
  childDocument,
  wrappedChildDocument,
  grandChildDocument,
];

export const documentsObject = documents.reduce(
  (docs, document) => ({
    ...docs,
    [document.id]: document,
  }),
  {},
);

export const documentFiles = [
  {
    path: document1.path,
    textContent: document1Serialized,
  },
  {
    path: document2.path,
    textContent: document2Serialized,
  },
  {
    path: wrappedDocument.path,
    textContent: wrappedDocumentSerialized,
  },
  {
    path: childDocument.path,
    textContent: childDocumentSerialized,
  },
  {
    path: wrappedChildDocument.path,
    textContent: wrappedChildDocumentSerialized,
  },
  {
    path: grandChildDocument.path,
    textContent: grandChildDocumentSerialized,
  },
];

export const viewTypeConfigs = [boardViewTypeConfig, pageViewTypeConfig];
