import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Element } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  emptyParagraphElement,
  emptyTitleElement,
  linkElement1,
  listItemElement1,
  paragraphElement1,
  paragraphElement1PlainText,
  paragraphElement2,
  paragraphElement2PlainText,
  titleElement1,
  titleElement1PlainText,
} from '../test-utils';
import { withBlockReset } from '../withBlockReset';
import { TITLE_ELEMENT_TYPE } from './TitleElement';
import { withTitle } from './withTitle';

const createEditor = (content: Element[]) =>
  withTitle(createTestEditor(content));

describe('withTitle', () => {
  afterEach(cleanup);

  describe('normalizeNode', () => {
    it('inserts an empty title when the document does not start with one', () => {
      // Create an editor without a title element
      const editor = createEditor([paragraphElement1]);

      // Run normalization over the entire document
      SlateEditor.normalize(editor, { force: true });

      // An empty title element should be inserted as the first node
      expect(editor.children[0]).toMatchObject({
        type: TITLE_ELEMENT_TYPE,
        children: [{ text: '' }],
      });
      // The original content should be preserved below it
      expect(editor.children[1]).toMatchObject({
        children: [{ text: paragraphElement1PlainText }],
      });
    });

    it('re-inserts an empty title when the title is removed', () => {
      // Create an editor with a title and a paragraph
      const editor = createEditor([titleElement1, paragraphElement1]);

      // Remove the title element
      Transforms.removeNodes(editor, { at: [0] });

      // An empty title element should be re-inserted as the first node
      expect(editor.children[0]).toMatchObject({
        type: TITLE_ELEMENT_TYPE,
        children: [{ text: '' }],
      });
    });

    it('inserts an empty paragraph when the title is the only element', () => {
      // Create an editor containing only a title
      const editor = createEditor([titleElement1]);

      // Run normalization over the entire document
      SlateEditor.normalize(editor, { force: true });

      // An empty paragraph should be inserted below the title
      expect(editor.children.length).toBe(2);
      expect(editor.children[1]).toMatchObject({
        type: 'paragraph',
        children: [{ text: '' }],
      });
    });

    it('re-inserts a paragraph when the last content block is removed', () => {
      // Create an editor with a title and a paragraph
      const editor = createEditor([titleElement1, paragraphElement1]);

      // Remove the only content block
      Transforms.removeNodes(editor, { at: [1] });

      // An empty paragraph should be re-inserted below the title
      expect(editor.children.length).toBe(2);
      expect(editor.children[1]).toMatchObject({
        type: 'paragraph',
        children: [{ text: '' }],
      });
    });

    it('converts stray title elements into paragraphs', () => {
      // Create an editor containing a second title element
      const editor = createEditor([
        titleElement1,
        { ...titleElement1, children: [{ text: 'Stray title' }] },
      ]);

      // Run normalization over the entire document
      SlateEditor.normalize(editor, { force: true });

      // The stray title element should be converted into a paragraph
      expect(editor.children[1]).toMatchObject({
        type: 'paragraph',
        children: [{ text: 'Stray title' }],
      });
    });

    it('strips marks from the title text', () => {
      // Create an editor with a bold mark on the title text
      const editor = createEditor([
        {
          ...titleElement1,
          children: [{ text: titleElement1PlainText, bold: true }],
        },
      ]);

      // Run normalization over the entire document
      SlateEditor.normalize(editor, { force: true });

      // The mark should be stripped from the title text
      expect(editor.children[0]).toMatchObject({
        type: TITLE_ELEMENT_TYPE,
        children: [{ text: titleElement1PlainText }],
      });
      expect((editor.children[0] as Element).children[0]).not.toHaveProperty(
        'bold',
      );
    });

    it('unwraps inline elements nested inside the title', () => {
      // Create an editor with a link element inside the title
      const editor = createEditor([
        {
          ...titleElement1,
          children: [{ text: 'Before ' }, linkElement1, { text: ' after' }],
        },
      ]);

      // Run normalization over the entire document
      SlateEditor.normalize(editor, { force: true });

      // The title should contain only plain text
      (editor.children[0] as Element).children.forEach((child) => {
        expect(child).not.toHaveProperty('type');
      });
    });

    it('removes newline characters from the title text', () => {
      // Create an editor with a newline in the title text
      const editor = createEditor([
        { ...titleElement1, children: [{ text: 'Multi\nline' }] },
      ]);

      // Run normalization over the entire document
      SlateEditor.normalize(editor, { force: true });

      // The newline should be removed from the title text
      expect(editor.children[0]).toMatchObject({
        children: [{ text: 'Multiline' }],
      });
    });
  });

  describe('insertBreak', () => {
    it('moves the cursor into the content without splitting the title', () => {
      // Create an editor with a title and a paragraph
      const editor = createEditor([titleElement1, paragraphElement1]);

      // Set the selection to the middle of the title text
      Transforms.select(editor, { path: [0, 0], offset: 4 });

      // Insert a break
      editor.insertBreak();

      // The title should remain intact
      expect(editor.children[0]).toMatchObject({
        type: TITLE_ELEMENT_TYPE,
        children: [{ text: titleElement1PlainText }],
      });
      // No new node should be created
      expect(editor.children.length).toBe(2);
      // The selection should be at the start of the content
      expect(editor.selection).toMatchObject({
        anchor: { path: [1, 0], offset: 0 },
      });
    });

    it('creates an empty paragraph when the title is the only node', () => {
      // Create an editor containing only a title
      const editor = createEditor([titleElement1]);

      // Set the selection to the end of the title text
      Transforms.select(editor, {
        path: [0, 0],
        offset: titleElement1PlainText.length,
      });

      // Insert a break
      editor.insertBreak();

      // An empty paragraph should be created below the title
      expect(editor.children[1]).toMatchObject({
        type: 'paragraph',
        children: [{ text: '' }],
      });
      // The selection should be at the start of the new paragraph
      expect(editor.selection).toMatchObject({
        anchor: { path: [1, 0], offset: 0 },
      });
    });

    it('inserts breaks outside the title as normal', () => {
      // Create an editor with a title and a paragraph
      const editor = createEditor([titleElement1, paragraphElement1]);

      // Set the selection to the end of the paragraph text
      Transforms.select(editor, {
        path: [1, 0],
        offset: paragraphElement1PlainText.length,
      });

      // Insert a break
      editor.insertBreak();

      // The paragraph should be split as normal
      expect(editor.children.length).toBe(3);
    });
  });

  describe('insertSoftBreak', () => {
    it('moves the cursor into the content instead of inserting a line break', () => {
      // Create an editor containing only a title
      const editor = createEditor([titleElement1]);

      // Set the selection to the end of the title text
      Transforms.select(editor, {
        path: [0, 0],
        offset: titleElement1PlainText.length,
      });

      // Insert a soft break
      editor.insertSoftBreak();

      // The title text should not contain a line break
      expect(editor.children[0]).toMatchObject({
        children: [{ text: titleElement1PlainText }],
      });
      // The selection should be at the start of the content
      expect(editor.selection).toMatchObject({
        anchor: { path: [1, 0], offset: 0 },
      });
    });
  });

  describe('insertText', () => {
    it('strips newlines from text inserted into the title', () => {
      // Create an editor with an empty title
      const editor = createEditor([emptyTitleElement, paragraphElement1]);

      // Set the selection into the title
      Transforms.select(editor, { path: [0, 0], offset: 0 });

      // Insert text containing newlines
      editor.insertText('Multi\nline\ntext');

      // The newlines should be replaced with spaces
      expect(editor.children[0]).toMatchObject({
        children: [{ text: 'Multi line text' }],
      });
    });
  });

  describe('insertFragment', () => {
    it('flattens fragments pasted into the title to plain text', () => {
      // Create an editor with an empty title
      const editor = createEditor([emptyTitleElement, paragraphElement1]);

      // Set the selection into the title
      Transforms.select(editor, { path: [0, 0], offset: 0 });

      // Paste a fragment containing multiple blocks
      editor.insertFragment([paragraphElement2, paragraphElement1]);

      // The fragment should be flattened into the title text
      expect(editor.children[0]).toMatchObject({
        type: TITLE_ELEMENT_TYPE,
        children: [
          {
            text: `${paragraphElement2PlainText} ${paragraphElement1PlainText}`,
          },
        ],
      });
      // No new blocks should be created
      expect(editor.children.length).toBe(2);
    });
  });

  describe('deleteBackward', () => {
    it('does nothing at the start of the title', () => {
      // Create an editor with a title and a paragraph
      const editor = createEditor([titleElement1, paragraphElement1]);

      // Set the selection to the start of the title
      Transforms.select(editor, { path: [0, 0], offset: 0 });

      // Delete backward
      editor.deleteBackward('character');

      // The document should remain unchanged
      expect(editor.children[0]).toMatchObject({
        children: [{ text: titleElement1PlainText }],
      });
      expect(editor.children.length).toBe(2);
    });

    it('prevents merging content into the title', () => {
      // Create an editor with a title and a paragraph
      const editor = createEditor([titleElement1, paragraphElement1]);

      // Set the selection to the start of the paragraph
      Transforms.select(editor, { path: [1, 0], offset: 0 });

      // Delete backward
      editor.deleteBackward('character');

      // The paragraph should not be merged into the title
      expect(editor.children.length).toBe(2);
      expect(editor.children[0]).toMatchObject({
        children: [{ text: titleElement1PlainText }],
      });
      // The selection should be at the end of the title
      expect(editor.selection).toMatchObject({
        anchor: { path: [0, 0], offset: titleElement1PlainText.length },
      });
    });

    it('resets non default blocks at their start instead of moving into the title', () => {
      // Compose the title plugin over the block reset plugin as
      // in the editor's plugin chain
      const editor = withTitle(
        withBlockReset(createTestEditor([titleElement1, listItemElement1])),
      );

      // Set the selection to the start of the to-do element
      Transforms.select(editor, { path: [1, 0], offset: 0 });

      // Delete backward
      editor.deleteBackward('character');

      // The to-do element should be reset to a paragraph
      expect(editor.children.length).toBe(2);
      expect(editor.children[1]).toMatchObject({ type: 'paragraph' });
      // The title should remain unchanged
      expect(editor.children[0]).toMatchObject({
        children: [{ text: titleElement1PlainText }],
      });
    });

    it('removes an empty first paragraph and moves the cursor to the title', () => {
      // Create an editor with an empty paragraph between title and content
      const editor = createEditor([
        titleElement1,
        emptyParagraphElement,
        paragraphElement1,
      ]);

      // Set the selection to the start of the empty paragraph
      Transforms.select(editor, { path: [1, 0], offset: 0 });

      // Delete backward
      editor.deleteBackward('character');

      // The empty paragraph should be removed
      expect(editor.children.length).toBe(2);
      expect(editor.children[1]).toMatchObject({
        children: [{ text: paragraphElement1PlainText }],
      });
      // The selection should be at the end of the title
      expect(editor.selection).toMatchObject({
        anchor: { path: [0, 0], offset: titleElement1PlainText.length },
      });
    });
  });

  describe('deleteForward', () => {
    it('prevents merging content into the title at the end of the title', () => {
      // Create an editor with a title and a paragraph
      const editor = createEditor([titleElement1, paragraphElement1]);

      // Set the selection to the end of the title text
      Transforms.select(editor, {
        path: [0, 0],
        offset: titleElement1PlainText.length,
      });

      // Delete forward
      editor.deleteForward('character');

      // The paragraph should not be merged into the title
      expect(editor.children.length).toBe(2);
      // The selection should be at the start of the content
      expect(editor.selection).toMatchObject({
        anchor: { path: [1, 0], offset: 0 },
      });
    });

    it('does nothing at the end of the title when there is no content', () => {
      // Create an editor containing only a title
      const editor = createEditor([titleElement1]);

      // Set the selection to the end of the title text
      Transforms.select(editor, {
        path: [0, 0],
        offset: titleElement1PlainText.length,
      });

      // Delete forward
      editor.deleteForward('character');

      // The document should remain unchanged
      expect(editor.children.length).toBe(1);
      expect(editor.children[0]).toMatchObject({
        children: [{ text: titleElement1PlainText }],
      });
    });
  });

  describe('deleteFragment', () => {
    it('clamps deletion to the content when the selection spans the title', () => {
      // Create an editor with a title and two paragraphs
      const editor = createEditor([
        titleElement1,
        paragraphElement1,
        paragraphElement2,
      ]);

      // Select from the middle of the title into the second paragraph
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 4 },
        focus: { path: [2, 0], offset: 10 },
      });

      // Delete the selection
      editor.deleteFragment();

      // The title should remain intact
      expect(editor.children[0]).toMatchObject({
        children: [{ text: titleElement1PlainText }],
      });
      // The content should be deleted up to the selection end
      expect(editor.children.length).toBe(2);
      expect(editor.children[1]).toMatchObject({
        children: [{ text: paragraphElement2PlainText.slice(10) }],
      });
    });

    it('preserves the title on select-all and delete', () => {
      // Create an editor with a title and two paragraphs
      const editor = createEditor([
        titleElement1,
        paragraphElement1,
        paragraphElement2,
      ]);

      // Select the entire document
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [2, 0], offset: paragraphElement2PlainText.length },
      });

      // Delete the selection
      editor.deleteFragment();

      // The title should remain intact
      expect(editor.children[0]).toMatchObject({
        type: TITLE_ELEMENT_TYPE,
        children: [{ text: titleElement1PlainText }],
      });
      // The content should be reduced to a single empty block
      expect(editor.children.length).toBe(2);
      expect(editor.children[1]).toMatchObject({
        children: [{ text: '' }],
      });
    });

    it('deletes fragments outside the title as normal', () => {
      // Create an editor with a title and two paragraphs
      const editor = createEditor([
        titleElement1,
        paragraphElement1,
        paragraphElement2,
      ]);

      // Select across the two paragraphs
      Transforms.select(editor, {
        anchor: { path: [1, 0], offset: 0 },
        focus: { path: [2, 0], offset: paragraphElement2PlainText.length },
      });

      // Delete the selection
      editor.deleteFragment();

      // The content should be merged into a single empty block
      expect(editor.children.length).toBe(2);
      expect(editor.children[1]).toMatchObject({
        children: [{ text: '' }],
      });
    });
  });
});
