import { Node } from 'slate';
import { Editable, Slate } from 'slate-react';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { TextElement } from '@minddrop/ast';
import { render } from '@minddrop/test-utils';
import { cleanup, createTestEditor } from '../test-utils';
import { boldMarkConfig, paragraphElement1 } from '../test-utils/editor.data';
import { withMarks } from './withMarks';

const renderEditor = (children: TextElement[]) => {
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

      // Should mark the text as 'bold', recording the delimiter which was
      // typed so that it is written back the same way
      expect(Node.get(editor, [0, 0])).toEqual({
        text: 'bold',
        bold: true,
        boldSyntax: '**',
      });
    });

    it('records the delimiter which was typed', () => {
      // Render an editor containing a text node partially wrapped by the
      // underscore spelling of the bold shortcut
      const { editor } = renderEditor([{ text: '__bold_' }]);

      // Complete the wrapping shortcut
      editor.insertText('_');

      expect(Node.get(editor, [0, 0])).toEqual({
        text: 'bold',
        bold: true,
        boldSyntax: '__',
      });
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
