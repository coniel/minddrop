/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { RichTextDocument } from '@minddrop/rich-text';
import { RichTextEditor } from './RichTextEditor';
import { TitlePlugin } from '../TitlePlugin';
import { ParagraphPlugin } from '../ParagraphPlugin';
import { generateId } from '@minddrop/utils';

export default {
  title: 'editor/Editor',
  component: RichTextEditor,
};

const document: RichTextDocument = {
  revision: 'rev-id',
  content: [
    {
      id: generateId(),
      type: 'title',
      children: [{ text: 'Vivamus elementum ' }],
    },
    {
      id: generateId(),
      type: 'paragraph',
      children: [
        {
          text: 'Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.',
        },
      ],
    },
  ],
};

const document2: RichTextDocument = {
  revision: 'rev-2-id',
  content: [
    {
      id: document.content[0].id,
      type: 'title',
      children: [{ text: 'Vivamus elementum edited' }],
    },
    {
      id: document.content[1].id,
      type: 'paragraph',
      children: [
        {
          text: 'Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.',
        },
      ],
    },
    {
      id: generateId(),
      type: 'paragraph',
      children: [
        {
          text: 'New paragraph',
        },
      ],
    },
  ],
};

export const BareEditor: React.FC = () => {
  return (
    <div>
      <RichTextEditor
        document={document}
        onChange={(doc) => console.log(doc)}
      />
    </div>
  );
};

export const WithPlugins: React.FC = () => {
  const [value, setValue] = useState(document);

  useEffect(() => {
    setTimeout(() => {
      setValue(document2);
    }, 4000);
  }, []);

  return (
    <div>
      <RichTextEditor
        document={value}
        onChange={setValue}
        plugins={[TitlePlugin, ParagraphPlugin]}
      />
      <button type="button" onClick={() => setValue(document2)}>
        Load value
      </button>
    </div>
  );
};
