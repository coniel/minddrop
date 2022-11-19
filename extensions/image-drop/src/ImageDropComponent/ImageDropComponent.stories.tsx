import React from 'react';
import { initializeCore } from '@minddrop/core';
import { Drops, useDrop } from '@minddrop/drops';
import { Files, FileReferencesResource, FileReference } from '@minddrop/files';
import * as FilesExtension from '@minddrop/files';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { Resources } from '@minddrop/resources';
import { ImageDropComponent } from './ImageDropComponent';
import { ImageDropData } from '../types';
import { ImageDropConfig } from '../ImageDropConfig';

export default {
  title: 'drops/Image',
  component: ImageDropComponent,
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

// Create a drop with an image file
const dropWithFile = Resources.generateDocument('drops:drop', {
  type: 'image',
  file: fileReference.id,
});

// Create a drop without an image file
const dropWithoutFile = Resources.generateDocument('drops:drop', {
  type: 'image',
});

// Run the files extension
FilesExtension.onRun(core);
// Load the preview image file reference
FileReferencesResource.store.load(core, [fileReference]);
// Register the image drop type
Drops.register(core, ImageDropConfig);
// Load the drops
Drops.store.load(core, [dropWithFile, dropWithoutFile]);

// Register a mock file storage adapter
Files.registerStorageAdapter({
  getUrl: () => 'https://placekitten.com/1200/1200',
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

export const WithFile: React.FC = () => {
  const liveDrop = useDrop<ImageDropData>(dropWithFile.id);

  return (
    <div style={{ maxWidth: 400 }}>
      <ImageDropComponent
        {...liveDrop}
        currentParent={{ resource: 'topics:topic', id: tSixDrops.id }}
      />
    </div>
  );
};

export const WithoutFile: React.FC = () => {
  const liveDrop = useDrop<ImageDropData>(dropWithoutFile.id);

  return (
    <div style={{ maxWidth: 400 }}>
      <ImageDropComponent
        {...liveDrop}
        currentParent={{ resource: 'topics:topic', id: tSixDrops.id }}
      />
    </div>
  );
};
