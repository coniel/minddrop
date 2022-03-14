import React, { useState } from 'react';
import { EditorContent } from '../types';
import { Editor } from './Editor';
import { TitlePlugin } from '../TitlePlugin';
import { ParagraphPlugin } from '../ParagraphPlugin';

export default {
  title: 'editor/Editor',
  component: Editor,
};

export const BareEditor: React.FC = () => {
  const [value, setValue] = useState<EditorContent>([
    { type: 'title', children: [{ text: 'Vivamus elementum ' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.',
        },
      ],
    },
  ]);

  return (
    <div>
      <Editor value={value} onChange={setValue} />
    </div>
  );
};

export const WithPlugins: React.FC = () => {
  const [value, setValue] = useState<EditorContent>([
    { type: 'title', children: [{ text: 'Vivamus elementum ' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.',
        },
      ],
    },
  ]);

  return (
    <div>
      <Editor
        value={value}
        onChange={setValue}
        plugins={[TitlePlugin, ParagraphPlugin]}
      />
    </div>
  );
};
