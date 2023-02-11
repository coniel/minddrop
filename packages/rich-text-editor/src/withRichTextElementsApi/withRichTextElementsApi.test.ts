import { ResourceReferences } from '@minddrop/resources';
import {
  RTBlockElement,
  RICH_TEXT_TEST_DATA,
  RichTextElements,
  RichTextDocuments,
  RTElement,
} from '@minddrop/rich-text';
import { Node } from 'slate';
import { setup, cleanup, core, createTestEditor } from '../test-utils';
import { Transforms } from '../Transforms';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { withRichTextElementsApi } from './withRichTextElementsApi';

const {
  richTextDocument1,
  richTextDocument2,
  paragraphElement1,
  paragraphElement2,
  linkElement1,
  headingElementConfig,
} = RICH_TEXT_TEST_DATA;

const SESSION_ID = 'session-id';

const richTextDocument1Reference = ResourceReferences.generate(
  RichTextDocuments.resource,
  richTextDocument1.id,
);
const richTextDocument2Reference = ResourceReferences.generate(
  RichTextDocuments.resource,
  richTextDocument2.id,
);
const paragraphElement1Reference = ResourceReferences.generate(
  RichTextElements.resource,
  paragraphElement1.id,
);

const createEditor = (content: RTBlockElement[]) => {
  // Create an editor session
  useRichTextEditorStore
    .getState()
    .addSession(SESSION_ID, richTextDocument1.id, richTextDocument1.revision);

  // Create an editor with the plugin applied, using the
  // session created above.
  return withRichTextElementsApi(core, createTestEditor(content), SESSION_ID);
};

// Pause updates on the editor session
const pauseUpdates = () =>
  useRichTextEditorStore.getState().pauseUpdates(SESSION_ID);

describe('withRichTextElementsApi', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Resume updates on the editor session
    useRichTextEditorStore.getState().resumeUpdates(SESSION_ID);
  });

  describe('create element', () => {
    describe('root level element', () => {
      it('creates a element with new base data', () => {
        // Create an editor with the plugin applied, containg a paragraph element
        const editor = createEditor([paragraphElement1]);

        // Insert a new element
        Transforms.insertNodes(
          editor,
          [{ ...paragraphElement2, deleted: true, deletedAt: new Date() }],
          { at: [1] },
        );

        // Get the inserted element
        const newElement = RichTextElements.get(
          (editor.children[1] as RTElement).id,
        );

        // The inserted element should be created as a RichTextElement
        expect(newElement).toBeDefined();
        // It regenrates the base data
        expect(newElement.id).not.toBe(paragraphElement2.id);
        expect(newElement.revision).not.toBe(paragraphElement2.revision);
        expect(newElement.createdAt).not.toBe(paragraphElement2.createdAt);
        expect(newElement.updatedAt).not.toBe(paragraphElement2.updatedAt);
        expect(newElement.parents.length).toBe(1);
        expect(newElement.parents[0].id).not.toBe(
          paragraphElement2.parents[0].id,
        );
        // It removes deleted state
        expect(newElement.deleted).toBeUndefined();
        expect(newElement.deletedAt).toBeUndefined();
      });

      it('udpates `children` on the rich text document', () => {
        // Create an editor with the plugin applied, containg a paragraph element.
        const editor = createEditor([paragraphElement1]);

        // Insert a new element
        Transforms.insertNodes(editor, [paragraphElement2], { at: [1] });

        // Get the inserted element from the editor
        const newElement = editor.children[1] as RTElement;

        // Should update rich text document's `children` to include the
        // new element.
        expect(RichTextDocuments.get(richTextDocument1.id).children).toEqual([
          paragraphElement1.id,
          newElement.id,
        ]);
      });

      it('updates the document revision', () => {
        // Get the current document revision
        const oldRevision = richTextDocument1.revision;

        // Create an editor with the plugin applied, containg a paragraph element
        const editor = createEditor([paragraphElement1]);

        // Insert a new element
        Transforms.insertNodes(editor, [paragraphElement2], { at: [1] });

        // Get the editor session
        const session = useRichTextEditorStore.getState().sessions[SESSION_ID];

        // Get the updated document
        const document = RichTextDocuments.get(richTextDocument1.id);

        // Document should have a new revision ID
        expect(document.revision).not.toEqual(oldRevision);

        // New revision should be added to editor session
        expect(session.documentRevisions).toEqual([
          oldRevision,
          document.revision,
        ]);
      });

      describe('with paused updates', () => {
        it('returns the element without creating it', () => {
          // The element to be inserted
          const newElement = {
            ...paragraphElement1,
            id: 'new-element',
            parents: [richTextDocument1Reference],
          };

          // Create an editor with the plugin applied, containg a paragraph element
          const editor = createEditor([paragraphElement1]);

          // Pause updates on the editor session
          pauseUpdates();

          // Insert a new element
          Transforms.insertNodes(editor, [newElement], { at: [1] });

          // The inserted element should not be created as a RichTextElement
          expect(RichTextElements.store.get(newElement.id)).toBeUndefined();
          // The document's children should not be updated
          expect(RichTextDocuments.get(richTextDocument1.id).children).toEqual(
            richTextDocument1.children,
          );
          // The element should be inserted into the editor
          expect(editor.children[1]).toEqual(newElement);
        });
      });
    });

    describe('nested element', () => {
      it('creates the element', () => {
        // Create an editor with the plugin applied, containg a paragraph element
        const editor = createEditor([paragraphElement1]);

        // Insert a new element
        Transforms.insertNodes(editor, [linkElement1], { at: [0, 1] });

        // Get the element from the edior
        const newElement = Node.get(editor, [0, 1]) as RTElement;

        // The inserted element should be created as a RichTextElement
        expect(RichTextElements.get(newElement.id)).toBeDefined();
      });

      it('updates the document revision', () => {
        // Get the current document revision
        const oldRevision = richTextDocument1.revision;

        // Create an editor with the plugin applied, containg a paragraph element
        const editor = createEditor([paragraphElement1]);

        // Insert a new element
        Transforms.insertNodes(editor, [linkElement1], { at: [0, 1] });

        // Get the editor session
        const session = useRichTextEditorStore.getState().sessions[SESSION_ID];

        // Get the updated document
        const document = RichTextDocuments.get(richTextDocument1.id);

        // Document should have a new revision ID
        expect(document.revision).not.toEqual(oldRevision);

        // New revision should be added to editor session
        expect(session.documentRevisions).toEqual([
          oldRevision,
          document.revision,
        ]);
      });

      describe('with paused updates', () => {
        it('returns the element without creating it', () => {
          // New link element to be inserted
          const newLinkElement = {
            ...linkElement1,
            id: 'new-link-element',
            parents: [richTextDocument1Reference, paragraphElement1Reference],
          };

          // Create an editor with the plugin applied, containg a paragraph element
          const editor = createEditor([paragraphElement1]);

          // Pause updates on the editor session
          pauseUpdates();

          // Insert a new element
          Transforms.insertNodes(editor, [newLinkElement], { at: [0, 1] });

          // The inserted element should not be created as a RichTextElement
          expect(RichTextElements.store.get(newLinkElement.id)).toBeUndefined();
          // The element should be inserted into the editor
          expect(Node.get(editor, [0, 1])).toEqual(newLinkElement);
        });
      });
    });
  });

  describe('update element', () => {
    describe('with paused updates', () => {
      it('does nothing', () => {
        // Create an editor with the plugin applied, containg a paragraph element
        const editor = createEditor([paragraphElement1]);

        // Pause updates on the editor session
        pauseUpdates();

        // Add some text to the start of the paragraph
        Transforms.insertText(editor, 'added text', {
          at: { path: [0, 0], offset: 0 },
        });

        // The element should not be updated in the RichTextElements store
        expect(RichTextElements.get(paragraphElement1.id)).toEqual(
          paragraphElement1,
        );
      });
    });

    it('updates the element', () => {
      // Create an editor with the plugin applied, containg an empty paragraph element
      const editor = createEditor([
        { ...paragraphElement1, children: [{ text: '' }] },
      ]);

      // Add some text to the start of the paragraph
      Transforms.insertText(editor, 'added text', {
        at: { path: [0, 0], offset: 0 },
      });

      // The element should be updated in the RichTextElements store
      expect(RichTextElements.get(paragraphElement1.id)).toEqual(
        expect.objectContaining({
          children: [{ text: 'added text' }],
        }),
      );
    });

    it('ignores updates which include the `type` field', () => {
      // Create an editor with the plugin applied, containg a paragraph element
      const editor = createEditor([paragraphElement1]);

      // Change the element type
      Transforms.setNodes(
        editor,
        { type: headingElementConfig.type },
        {
          at: { path: [0, 0], offset: 0 },
        },
      );

      // The element should no have been updated
      expect(RichTextElements.get(paragraphElement1.id).type).toBe(
        paragraphElement1.type,
      );
    });

    it('updates parents via [add/remove]Parents', () => {
      // Create an editor with the plugin applied, containg a paragraph element
      const editor = createEditor([paragraphElement1]);

      // Change the element's parents
      Transforms.setNodes(
        editor,
        {
          parents: [richTextDocument2Reference],
        },
        {
          at: { path: [0, 0], offset: 0 },
        },
      );

      // Get the updated element
      const element = RichTextElements.get(paragraphElement1.id);

      // Should replace old parent with new one
      expect(element.parents).toEqual([richTextDocument2Reference]);
    });

    it('updates the document revision', () => {
      // Get the current document revision
      const oldRevision = richTextDocument1.revision;

      // Create an editor with the plugin applied, containg an empty paragraph element
      const editor = createEditor([
        { ...paragraphElement1, children: [{ text: '' }] },
      ]);

      // Add some text to the start of the paragraph
      Transforms.insertText(editor, 'added text', {
        at: { path: [0, 0], offset: 0 },
      });

      // Get the editor session
      const session = useRichTextEditorStore.getState().sessions[SESSION_ID];

      // Get the updated document
      const document = RichTextDocuments.get(richTextDocument1.id);

      // Document should have a new revision ID
      expect(document.revision).not.toEqual(oldRevision);

      // New revision should be added to editor session
      expect(session.documentRevisions).toEqual([
        oldRevision,
        document.revision,
      ]);
    });
  });

  describe('delete element', () => {
    describe('root level element', () => {
      it('deletes the element', () => {
        // Create an editor with the plugin applied, containg two paragraph elements
        const editor = createEditor([paragraphElement1, paragraphElement2]);

        // Delete the second paragraph element
        Transforms.removeNodes(editor, { at: [1] });

        // Element should be deleted in the RichTextElements store
        expect(RichTextElements.get(paragraphElement2.id).deleted).toBe(true);
      });

      it('updates the document revision', () => {
        // Get the current document revision
        const oldRevision = richTextDocument1.revision;

        // Create an editor with the plugin applied, containg two paragraph elements
        const editor = createEditor([paragraphElement1, paragraphElement2]);

        // Delete the second paragraph element
        Transforms.removeNodes(editor, { at: [1] });

        // Get the editor session
        const session = useRichTextEditorStore.getState().sessions[SESSION_ID];

        // Get the updated document
        const document = RichTextDocuments.get(richTextDocument1.id);

        // Document should have a new revision ID
        expect(document.revision).not.toEqual(oldRevision);

        // New revision should be added to editor session
        expect(session.documentRevisions).toEqual([
          oldRevision,
          document.revision,
        ]);
      });

      it('udpates `children` on the rich text document', () => {
        // Create an editor with the plugin applied, containg two paragraph elements
        const editor = createEditor([paragraphElement1, paragraphElement2]);

        // Delete the second paragraph element
        Transforms.removeNodes(editor, { at: [1] });

        // Should update rich text document's `children` to include the
        // new element.
        expect(RichTextDocuments.get(richTextDocument1.id).children).toEqual([
          paragraphElement1.id,
        ]);
      });

      describe('with updates paused', () => {
        it('does nothing', () => {
          // Create an editor with the plugin applied, containg two paragraph elements
          const editor = createEditor([paragraphElement1, paragraphElement2]);

          // Pause updates on the editor session
          pauseUpdates();

          // Delete the second paragraph element
          Transforms.removeNodes(editor, { at: [1] });

          // Element should not be deleted in the RichTextElements store
          expect(
            RichTextElements.get(paragraphElement2.id).deleted,
          ).toBeUndefined();
        });
      });
    });

    describe('nested element', () => {
      it('deletes the element', () => {
        // Create an editor with the plugin applied, containg a paragraph element
        // with a link element as a child.
        const editor = createEditor([
          {
            ...paragraphElement1,
            children: [{ text: '' }, linkElement1, { text: '' }],
          },
        ]);

        // Delete the link element
        Transforms.removeNodes(editor, { at: [0, 1] });

        // Element should be deleted in the RichTextElements store
        expect(RichTextElements.get(linkElement1.id).deleted).toBe(true);
      });

      it('updates the document revision', () => {
        // Get the current document revision
        const oldRevision = richTextDocument1.revision;

        // Create an editor with the plugin applied, containg a paragraph element
        // with a link element as a child.
        const editor = createEditor([
          {
            ...paragraphElement1,
            children: [{ text: '' }, linkElement1, { text: '' }],
          },
        ]);

        // Delete the link element
        Transforms.removeNodes(editor, { at: [0, 1] });

        // Get the editor session
        const session = useRichTextEditorStore.getState().sessions[SESSION_ID];

        // Get the updated document
        const document = RichTextDocuments.get(richTextDocument1.id);

        // Document should have a new revision ID
        expect(document.revision).not.toEqual(oldRevision);

        // New revision should be added to editor session
        expect(session.documentRevisions).toEqual([
          oldRevision,
          document.revision,
        ]);
      });

      describe('with updates paused', () => {
        it('does nothing', () => {
          // Create an editor with the plugin applied, containg a paragraph element
          // with a link element as a child.
          const editor = createEditor([
            {
              ...paragraphElement1,
              children: [{ text: '' }, linkElement1, { text: '' }],
            },
          ]);

          // Pause updates on the editor session
          pauseUpdates();

          // Delete the link element
          Transforms.removeNodes(editor, { at: [0, 1] });

          // Element should not be deleted in the RichTextElements store
          expect(RichTextElements.get(linkElement1.id).deleted).toBeUndefined();
        });
      });
    });
  });
});
