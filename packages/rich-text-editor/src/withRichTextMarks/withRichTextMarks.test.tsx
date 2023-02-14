import React from 'react';
import { render } from '@minddrop/test-utils';
import {
  RTBlockElement,
  RICH_TEXT_TEST_DATA,
  RTNode,
} from '@minddrop/rich-text';
import { setup, cleanup, createTestEditor } from '../test-utils';
import { withRichTextMarks } from './withRichTextMarks';
import { Editable, Slate } from 'slate-react';
import { boldMarkConfig } from '../test-utils/rich-text-editor.data';

const { paragraphElement1 } = RICH_TEXT_TEST_DATA;

const renderEditor = (children: RTNode[]) => {
  const content: RTBlockElement[] = [
    {
      ...paragraphElement1,
      children,
    },
  ];

  // Create an editor with a 'bold' mark config
  const [editor, renderLeaf] = withRichTextMarks(createTestEditor(content), [
    boldMarkConfig,
  ]);

  return render(
    <Slate editor={editor} value={content}>
      <Editable renderLeaf={renderLeaf} />
    </Slate>,
  );
};

describe('withRichTextMarks', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders formatted text using the mark component', () => {
    // Render an editor containing 'bold' formatted text node
    const { getByText } = renderEditor([{ text: 'Test', bold: true }]);

    // Should wrap the text node in the 'bold' mark's component
    expect(getByText('Test').parentNode?.nodeName).toBe('STRONG');
  });
});
