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
import { Node } from 'slate';

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

  return {
    editor,
    ...render(
      <Slate editor={editor} value={content}>
        <Editable renderLeaf={renderLeaf} />
      </Slate>,
    ),
  };
};

describe('withRichTextMarks', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders formatted text using the mark component', () => {
    // Render an editor containing 'bold' marked text node
    const { getByText } = renderEditor([{ text: 'Test', bold: true }]);

    // Should wrap the text node in the 'bold' mark's component
    expect(getByText('Test').parentNode?.nodeName).toBe('STRONG');
  });

  describe('shortcuts', () => {
    it('marks the selection if not already marked', () => {
      // Render an editor containing a text node partially
      // wrapped by the bold mark shortcut.
      const { editor } = renderEditor([{ text: '**bold*' }]);

      // Complete the wrapping shortcut
      editor.insertText('*');

      // Should mark the text as 'bold'
      expect(Node.get(editor, [0, 0])).toEqual({ text: 'bold', bold: true });
    });

    it('unmarks the selection if already marked', () => {
      // Render an editor containing a 'bold' marked text
      // node partially wrapped by the bold mark shortcut.
      const { editor } = renderEditor([{ text: '**bold*', bold: true }]);

      // Complete the wrapping shortcut
      editor.insertText('*');

      // Should remove 'bold' mark
      expect(Node.get(editor, [0, 0])).toEqual({ text: 'bold' });
    });

    it('collapses the selection to the trailing edge', () => {
      // Render an editor containing a text node partially
      // wrapped by the bold mark shortcut.
      const { editor } = renderEditor([{ text: '**bold*' }]);

      // Complete the wrapping shortcut
      editor.insertText('*');

      // Should collapse the selection to the end of the text
      expect(editor.selection).toEqual({
        anchor: { path: [0, 0], offset: 4 },
        focus: { path: [0, 0], offset: 4 },
      });
    });
  });
});
