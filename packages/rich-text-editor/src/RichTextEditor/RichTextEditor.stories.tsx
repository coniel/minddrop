import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import { RichTextElements, RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { initializeCore } from '@minddrop/core';
import { registerDefaultRichTextElementTypes } from '../utils';

const { richTextDocument1 } = RICH_TEXT_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

RichTextElements.typeConfigsStore.clear();

// Register the default element types
registerDefaultRichTextElementTypes(core);

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
