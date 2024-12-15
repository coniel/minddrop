import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { render } from '@minddrop/test-utils';
import { Ast, Element } from '@minddrop/ast';
import { Text } from '../types';
import { setup, cleanup, createTestEditor } from '../test-utils';
import { withMarks } from './withMarks';
import { Editable, Slate } from 'slate-react';
import { boldMarkConfig, paragraphElement1 } from '../test-utils/editor.data';
import { Node } from 'slate';

const renderEditor = (children: Text[]) => {
  const content: Element[] = [
    Ast.generateElement(paragraphElement1.type, { children }),
  ];

  // Create an editor with a 'bold' mark config
  const [editor, renderLeaf] = withMarks(createTestEditor(content), [
    boldMarkConfig,
  ]);

  return {
    editor,
    ...render(
      <Slate editor={editor} initialValue={content}>
        <Editable renderLeaf={renderLeaf} />
      </Slate>,
    ),
  };
};

describe('withMarks', () => {
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
