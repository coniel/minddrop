import React from 'react';
import { initializeCore } from '@minddrop/core';
import { Drops, useDrop } from '@minddrop/drops';
import { registerBackendUtilsAdapter } from '@minddrop/utils';
import { Files, FileReferencesResource, FileReference } from '@minddrop/files';
import * as FilesExtension from '@minddrop/files';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { Resources } from '@minddrop/resources';
import { BookmarkDropComponent } from './BookmarkDropComponent';
import { BookmarkDropData } from '../types';
import { BookmarkDropConfig } from '../BookmarkDropConfig';

export default {
  title: 'drops/Bookmark',
  component: BookmarkDropComponent,
};

const { tSixDrops } = TOPICS_TEST_DATA;

const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop/text-drop',
});

// Create a file reference for the preview image file
const fileReference: FileReference = Resources.generateDocument(
  'files:file-reference',
  {
    type: 'image/png',
    name: 'image.png',
    size: 200,
  },
);

// Create a drop with preview data
const dropWithPreview = Resources.generateDocument('drops:drop', {
  type: 'bookmark',
  hasPreview: true,
  url: 'https://minddrop.app',
  title: 'MindDrop',
  image: fileReference.id,
  description:
    'Organize your projects, studies, research, and ideas into a visual workspace.',
});

// Create a drop without preview data
const dropWithoutPreview = Resources.generateDocument('drops:drop', {
  type: 'bookmark',
  hasPreview: false,
  url: 'https://minddrop.app',
});

// Create a drop without a URL
const dropWithoutUrl = Resources.generateDocument('drops:drop', {
  type: 'bookmark',
  hasPreview: false,
  url: '',
});

// Ru nthe files extension
FilesExtension.onRun(core);
// Load the preview image file reference
FileReferencesResource.store.load(core, [fileReference]);
// Register the bookmark drop type
Drops.register(core, BookmarkDropConfig);
// Load the drops
Drops.store.load(core, [dropWithPreview, dropWithoutPreview, dropWithoutUrl]);

// Register a mock file storage adapter
Files.registerStorageAdapter({
  getUrl: () =>
    'https://ichef.bbci.co.uk/news/976/cpsprodpb/DE1C/production/_125406865_gettyimages-963041196-1.jpg',
  save: async () =>
    FileReferencesResource.create(core, {
      type: 'image/png',
      name: 'image.png',
      size: 200,
    }),
  download: async () =>
    FileReferencesResource.create(core, {
      type: 'image/png',
      name: 'image.png',
      size: 200,
    }),
});

// Register a mock backend utils adapter
registerBackendUtilsAdapter({
  getWebpageMedata: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: 'MindDrop',
          description:
            'Organize your projects, studies, research, and ideas into a visual workspace.',
          image:
            'https://ichef.bbci.co.uk/news/976/cpsprodpb/DE1C/production/_125406865_gettyimages-963041196-1.jpg',
        });
      }, 2000);
    }),
});

export const WithPreview: React.FC = () => {
  const liveDrop = useDrop<BookmarkDropData>(dropWithPreview.id);

  return (
    <div style={{ maxWidth: 400 }}>
      <BookmarkDropComponent
        {...liveDrop}
        currentParent={{ resource: 'topics:topic', id: tSixDrops.id }}
      />
    </div>
  );
};

export const WithoutPreview: React.FC = () => {
  const liveDrop = useDrop<BookmarkDropData>(dropWithoutPreview.id);

  return (
    <div style={{ maxWidth: 400 }}>
      <BookmarkDropComponent
        {...liveDrop}
        currentParent={{ resource: 'topics:topic', id: tSixDrops.id }}
      />
    </div>
  );
};

export const WithoutUrl: React.FC = () => {
  const liveDrop = useDrop<BookmarkDropData>(dropWithoutUrl.id);

  return (
    <div style={{ maxWidth: 400 }}>
      <BookmarkDropComponent
        {...liveDrop}
        currentParent={{ resource: 'topics:topic', id: tSixDrops.id }}
      />
    </div>
  );
};
