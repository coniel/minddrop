import {
  RTBlockElement,
  RTInlineElement,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import { setup, cleanup, createTestEditor } from '../test-utils';
import { Transforms } from '../Transforms';
import {
  EditorSession,
  useRichTextEditorStore,
} from '../useRichTextEditorStore';
import { withRichTextEditorStore } from './withRichTextEditorStore';

const { paragraphElement1, paragraphElement2, linkElement1 } =
  RICH_TEXT_TEST_DATA;

interface LinkElement extends RTInlineElement {
  url: string;
}

function getEditorSessionValue(key: keyof EditorSession) {
  // Return the session data
  return useRichTextEditorStore.getState().sessions['session-id'][key];
}

const createEditor = (content: RTBlockElement[]) => {
  // Create an editor session
  useRichTextEditorStore.getState().addSession('session-id');

  // Create an editor with the plugin applied, using the
  // session created above.
  return withRichTextEditorStore(createTestEditor(content), 'session-id');
};

describe('withRichTextEditorStore', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('create element', () => {
    it('adds the element to `createdElements`', () => {
      // Create an editor with the plugin applied, containg a paragraph element
      const editor = createEditor([paragraphElement1]);

      // Insert a new element
      Transforms.insertNodes(editor, [paragraphElement2], { at: [1] });

      // The inserted element should be in the store's `createdElements`
      expect(
        getEditorSessionValue('createdElements')[paragraphElement2.id],
      ).toEqual(paragraphElement2);
    });

    it('removes the element ID from `deletedElements` if present', () => {
      // Create an editor with the plugin applied, containg two paragraph elements
      const editor = createEditor([paragraphElement1, paragraphElement2]);

      // Delete the second paragraph
      Transforms.removeNodes(editor, { at: [1] });

      // Insert the second paragraph back in
      Transforms.insertNodes(editor, [paragraphElement2], { at: [1] });

      // The inserted element ID should no longer be in the store's `deletedElements`
      expect(getEditorSessionValue('deletedElements')).not.toContain(
        paragraphElement2.id,
      );
    });
  });

  describe('update element', () => {
    describe('existing element', () => {
      it('adds the data to `updatedElements`', () => {
        // Create an editor with the plugin applied, containg an empty paragraph element
        const editor = createEditor([
          { ...paragraphElement1, children: [{ text: '' }] },
        ]);

        // Add some text to the start of the paragraph
        Transforms.insertText(editor, 'added text', {
          at: { path: [0, 0], offset: 0 },
        });

        // The updated element data should be in the store's `updatedElements`
        expect(
          getEditorSessionValue('updatedElements')[paragraphElement1.id],
        ).toEqual({ children: [{ text: 'added text' }] });
      });

      it('preserves previously set `updatedElements` data for the element', () => {
        // Create an editor with the plugin applied, containg a paragraph
        // element, which contains an empty link element.
        const editor = createEditor([
          {
            ...paragraphElement1,
            children: [
              { text: '' },
              {
                ...linkElement1,
                url: '',
                children: [{ text: '' }],
              } as LinkElement,
            ],
          },
        ]);

        // Add some text to the link element
        Transforms.insertText(editor, 'MindDrop website', {
          at: { path: [0, 1, 0], offset: 0 },
        });

        // Perform a second update, setting the link's `url` property
        Transforms.setNodes<LinkElement>(
          editor,
          { url: 'https://minddrop.app' },
          {
            at: [0, 1],
          },
        );

        // The updated element data in the store should contain the data
        // from both updates.
        expect(
          getEditorSessionValue('updatedElements')[linkElement1.id],
        ).toEqual({
          url: 'https://minddrop.app',
          children: [{ text: 'MindDrop website' }],
        });
      });
    });

    describe('new element', () => {
      it('updates the element data in `createdElements`', () => {
        // Create an editor with the plugin applied, containg a paragraph element
        const editor = createEditor([paragraphElement1]);

        // Insert a new element
        Transforms.insertNodes(
          editor,
          { ...paragraphElement2, children: [{ text: '' }] },
          { at: [1] },
        );

        // Update the element's children
        Transforms.insertText(editor, 'added text', { at: [1, 0] });

        // Update data should be updated in the store's `createdElements`
        expect(
          getEditorSessionValue('createdElements')[paragraphElement2.id]
            .children,
        ).toEqual([{ text: 'added text' }]);
        // Update data should not be added to the store's `updatedElements`
        expect(
          getEditorSessionValue('updatedElements')[paragraphElement2.id],
        ).not.toBeDefined();
      });
    });
  });

  describe('delete element', () => {
    it('adds the element ID to `deletedElements`', () => {
      // Create an editor with the plugin applied, containg two paragraph elements
      const editor = createEditor([paragraphElement1, paragraphElement2]);

      // Delete the second paragraph element
      Transforms.removeNodes(editor, { at: [1] });

      // The removed element's ID should be in the store's `deletedElements`
      expect(getEditorSessionValue('deletedElements')).toContain(
        paragraphElement2.id,
      );
    });

    it('removes the element from `createdElements` if present', () => {
      // Create an editor with the plugin applied, containg a paragraph element
      const editor = createEditor([paragraphElement1]);

      // Insert a new element
      Transforms.insertNodes(editor, [paragraphElement2], { at: [1] });

      // Delete the inserted element
      Transforms.removeNodes(editor, { at: [1] });

      // The deleted element should no longer be in the store's
      // `createdElements`.
      expect(
        getEditorSessionValue('createdElements')[paragraphElement2.id],
      ).not.toBeDefined();
      // It should not add the element ID to the store's `deletedElements`
      expect(getEditorSessionValue('deletedElements')).not.toContain(
        paragraphElement2.id,
      );
    });

    it('removes the element update data from `updatedElements` if present', () => {
      // Create an editor with the plugin applied, containg two paragraph elements
      const editor = createEditor([paragraphElement1, paragraphElement2]);

      // Update the second paragraph
      Transforms.insertText(editor, 'added text', { at: [1, 0] });

      // Delete the second paragraph
      Transforms.removeNodes(editor, { at: [1] });

      // The deleted element should no longer be in the store's `updatedElements`
      expect(
        getEditorSessionValue('updatedElements')[paragraphElement2.id],
      ).not.toBeDefined();
    });
  });

  describe('set document children', () => {
    it('sets `documentChildren`', () => {
      // Create an editor with the plugin applied, containg a paragraph element.
      const editor = createEditor([paragraphElement1]);

      // Insert a new element
      Transforms.insertNodes(editor, [paragraphElement2], { at: [1] });

      // Store's `documentChildren` should be updated to the new value
      expect(getEditorSessionValue('documentChildren')).toEqual([
        paragraphElement1.id,
        paragraphElement2.id,
      ]);
    });
  });
});
