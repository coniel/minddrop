import { Editor, Node } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Ast, Element, HeadingElement } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import {
  cleanup,
  createTestEditor,
  emptyParagraphElement,
  headingElementConfig,
  linkElement1,
  paragraphElement1,
  setup,
} from '../test-utils';
import { EditorBlockElementConfig } from '../types';
import { withBlockShortcuts } from './withBlockShortcuts';

const headingConfig: EditorBlockElementConfig<HeadingElement> = {
  ...headingElementConfig,
  shortcuts: ['# '],
};

describe('withBlockShortcuts', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('converts an element when a shortcut is typed at the start a block element', () => {
    // Create an editor instance configured with the plugin using the heading
    // element configuration containing an empty paragraph element.
    const editor = withBlockShortcuts(
      createTestEditor([emptyParagraphElement]),
      [headingConfig],
    );

    // Insert the heading shortcut text at the beggining of the paragraph element
    Transforms.insertText(editor, '# ', { at: [0, 0] });

    // Get the element from the document
    const element = Node.get(editor, [0]) as Element;

    // The paragraph element should be converted into a heading element
    expect(element.type).toBe(headingConfig.type);
  });

  it('works with elements which contain text', () => {
    // Create an editor instance configured with the plugin using the heading
    // element configuration containing a paragraph element.
    const editor = withBlockShortcuts(createTestEditor([paragraphElement1]), [
      headingConfig,
    ]);

    // Insert the heading shortcut text at the beggining of the paragraph element
    Transforms.insertText(editor, '# ', { at: [0, 0] });

    // Get the element from the document
    const element = Node.get(editor, [0]) as Element;

    // The element paragraph should be converted into a heading element
    expect(element.type).toBe(headingConfig.type);
  });

  it('removes the shortcut text', () => {
    // Create an editor instance configured with the plugin using the heading
    // element configuration containing an empty paragraph element.
    const editor = withBlockShortcuts(
      createTestEditor([emptyParagraphElement]),
      [headingConfig],
    );

    // Insert the heading shortcut text at the beggining of the paragraph element
    Transforms.insertText(editor, '# ', { at: [0, 0] });

    // Get the element from the document
    const element = Node.get(editor, [0]) as Element;

    // Should remove the '# ' shortcut from the text
    expect(Ast.toPlainText([element])).toBe('');
  });

  it('only runs the shortcut if typed at the start of the block', () => {
    // Create an editor instance configured with the plugin using the heading element
    // configuration containing a paragraph element with a link element inside it.
    const editor = withBlockShortcuts(
      createTestEditor([
        {
          ...emptyParagraphElement,
          children: [{ text: '' }, linkElement1, { text: '' }],
        },
      ]),
      [headingConfig],
    );

    // Insert the heading shortcut text at the beggining of the paragraph element
    Transforms.insertText(editor, '# ', { at: [0, 2] });

    // Get the element from the document
    const element = Node.get(editor, [0]) as Element;

    // Element type should have remained 'paragraph'
    expect(element.type).toBe(emptyParagraphElement.type);
  });

  it('only runs if focus is at the end of the shortcut text', () => {
    // Create an editor instance configured with the plugin using the heading element
    // configuration containingn a paragraph element which has the shortcut string at
    // the start of the paragraph text.
    const editor = withBlockShortcuts(
      createTestEditor([
        // Paragraph text starts with the shortcut string
        { ...paragraphElement1, children: [{ text: '# Hello ' }] },
      ]),
      [headingConfig],
    );

    // Set selection to the end of the paragraph text
    Transforms.setSelection(editor, {
      anchor: Editor.end(editor, [0, 0]),
      focus: Editor.end(editor, [0, 0]),
    });
    // Insert text at the end of the paragraph
    Transforms.insertText(editor, 'world');

    // Get the element from the document
    const element = Node.get(editor, [0]) as Element;

    // Element type should have remained 'paragraph'
    expect(element.type).toBe(emptyParagraphElement.type);
  });

  it('does not run inside inline elements', () => {
    // Create an editor instance configured with the plugin using the heading element
    // configuration containing a paragraph element with a link element inside it.
    const editor = withBlockShortcuts(
      createTestEditor([
        {
          ...emptyParagraphElement,
          children: [{ text: '' }, linkElement1, { text: '' }],
        },
      ]),
      [headingConfig],
    );

    // Insert the heading shortcut text at the start of the link element
    Transforms.insertText(editor, '# ', { at: [0, 1, 0] });

    // Get the link element from the document
    const element = Node.get(editor, [0, 1]) as Element;

    // Element type should have remained 'link'
    expect(element.type).toBe(linkElement1.type);
  });
});
