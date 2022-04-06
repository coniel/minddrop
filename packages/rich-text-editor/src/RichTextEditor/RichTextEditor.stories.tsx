import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import { RichTextElements, RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { ParagraphElementConfig } from '../ParagraphElement';
import { HeadingOneElementConfig } from '../HeadingOneElement';
import { ToDoElementConfig } from '../ToDoElement';
import { initializeCore } from '@minddrop/core';

const { richTextDocument1 } = RICH_TEXT_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

RichTextElements.clearRegistered();

// Register element types
[ParagraphElementConfig, HeadingOneElementConfig, ToDoElementConfig].forEach(
  (config) => {
    RichTextElements.register(core, config);
  },
);

export default {
  title: 'editor/Editor',
  component: RichTextEditor,
};

export const Default: React.FC = () => {
  return (
    <div>
      <RichTextEditor documentId={richTextDocument1.id} />
    </div>
  );
};

export const MultipleEditorsSameDocument: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <RichTextEditor documentId={richTextDocument1.id} />
      </div>
      <div style={{ flex: 1 }}>
        <RichTextEditor documentId={richTextDocument1.id} />
      </div>
    </div>
  );
};
