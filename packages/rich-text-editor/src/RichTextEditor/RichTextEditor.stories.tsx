import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';

const { richTextDocument1 } = RICH_TEXT_TEST_DATA;

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
