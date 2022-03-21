import React from 'react';
import { cleanup, render } from '@minddrop/test-utils';
import { EditorContent, EditorPluginConfig } from '../types';
import { Editor } from './Editor';

const TestPluging: EditorPluginConfig = {
  elements: [
    {
      type: 'test-element',
      component: ({ children, attributes }) => (
        <div {...attributes}>
          <span>test-element</span>
          {children}
        </div>
      ),
    },
  ],
};

const value: EditorContent = [
  { id: 'id', type: 'test-element', children: [{ text: '' }] },
];

describe('Editor', () => {
  afterEach(cleanup);

  it('renders plugin elements', () => {
    const { getByText } = render(
      <Editor value={value} onChange={jest.fn()} plugins={[TestPluging]} />,
    );

    getByText('test-element');
  });
});
