import { Node } from 'slate';
import { ResourceReferences } from '@minddrop/resources';
import {
  RTElement,
  RICH_TEXT_TEST_DATA,
  RTBlockElement,
  RichTextDocuments,
  RichTextElements,
} from '@minddrop/rich-text';
import { arrayContainsObject } from '@minddrop/utils';
import { setup, cleanup, createTestEditor, core } from '../test-utils';
import { Transforms } from '../Transforms';
import { withParentReferences } from './withParentReferences';
import { withRichTextElementsApi } from '../withRichTextElementsApi';
import { useRichTextEditorStore } from '../useRichTextEditorStore';

const {
  richTextDocument1,
  paragraphElement1,
  paragraphElement2,
  linkElement1,
} = RICH_TEXT_TEST_DATA;

const SESSION_ID = 'session-id';

const createEditor = (content: RTBlockElement[]) => {
  // Create an editor session
  useRichTextEditorStore
    .getState()
    .addSession(SESSION_ID, richTextDocument1.id, richTextDocument1.revision);

  // Create an editor with the 'withRichTextElementsApi' plugin applied
  // so that inserted elements have a new ID generated.
  return withParentReferences(
    withRichTextElementsApi(core, createTestEditor(content), SESSION_ID),
    richTextDocument1.id,
  );
};

describe('withParentReferences', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('insert_node', () => {
    it('adds the document as a parent if not present', () => {
      // Create an editor with the plugin applied,
      // containg a paragraph element.
      const editor = createEditor([paragraphElement1]);

      // Insert a new inline element into the paragraph
      Transforms.insertNodes(editor, linkElement1, { at: [0, 0] });

      // The document reference
      const parentReference = ResourceReferences.generate(
        RichTextDocuments.resource,
        richTextDocument1.id,
      );

      // Get the inserted element, it has index 1 because a text
      // node will be inserted before it during normalization.
      const element = Node.get(editor, [0, 1]) as RTElement;

      // The inserted element should have the document parent reference
      expect(
        arrayContainsObject(element.parents, parentReference),
      ).toBeTruthy();
    });

    it('does not add the document as a parent if already present', () => {
      // Create an editor with the plugin applied, containg a
      // paragraph element.
      const editor = createEditor([paragraphElement1]);

      // Insert a new inline element which already has the document as
      // a parent into the paragraph.
      Transforms.insertNodes(
        editor,
        {
          ...linkElement1,

          parents: [
            ResourceReferences.generate(
              RichTextDocuments.resource,
              richTextDocument1.id,
            ),
          ],
        },
        { at: [0, 0] },
      );

      // Get the inserted element, it has index 1 because a text
      // node will be inserted before it during normalization.
      const element = Node.get(editor, [0, 1]) as RTElement;

      // The inserted element should only contain a signel reference
      // to the document.
      expect(
        ResourceReferences.get(RichTextDocuments.resource, element.parents)
          .length,
      ).toBe(1);
    });

    describe('nested inline elements', () => {
      it('adds the parent element as a parent', () => {
        // Create an editor with the plugin applied,
        // containg a paragraph element.
        const editor = createEditor([paragraphElement1]);

        // Insert a new inline element into the paragraph
        Transforms.insertNodes(editor, linkElement1, { at: [0, 0] });

        // The parent element's reference
        const parentReference = ResourceReferences.generate(
          RichTextElements.resource,
          paragraphElement1.id,
        );

        // Get the inserted element, it has index 1 because a text
        // node will be inserted before it during normalization.
        const element = Node.get(editor, [0, 1]) as RTElement;

        // The inserted element should have the parent reference
        expect(
          arrayContainsObject(element.parents, parentReference),
        ).toBeTruthy();
      });

      it('does not add the parent element as a parent if already preset', () => {
        // Create an editor with the plugin applied, containg a paragraph
        // paragraph element.
        const editor = createEditor([paragraphElement1]);

        // Insert a new inline element which already has the paragraph as
        // a parent into the paragraph.
        Transforms.insertNodes(
          editor,
          {
            ...linkElement1,
            parents: [
              ResourceReferences.generate(
                RichTextElements.resource,
                paragraphElement1.id,
              ),
            ],
          },
          { at: [0, 0] },
        );

        // Get the inserted element, it has index 1 because a text
        // node will be inserted before it during normalization.
        const element = Node.get(editor, [0, 1]) as RTElement;

        // The inserted element should contain only a single refernece to
        // the parent element.
        expect(
          ResourceReferences.getIds(RichTextElements.resource, element.parents)
            .length,
        ).toBe(1);
      });
    });
  });

  describe('split_node', () => {
    it('adds the document as a parent on the new element', () => {
      // Create an editor with the plugin applied, containg a paragraph
      // element.
      const editor = createEditor([
        { ...paragraphElement1, children: [{ text: 'onetwo' }] },
      ]);

      // Split the paragraph element.
      Transforms.splitNodes(editor, {
        at: { path: [0, 0], offset: 3 },
      });

      // Get the new paragraph element
      const paragraph = Node.get(editor, [1]) as RTElement;

      // New element should have the document as a parent
      expect(paragraph.parents).toEqual([
        ResourceReferences.generate(
          RichTextDocuments.resource,
          richTextDocument1.id,
        ),
      ]);
    });

    it('updates the parent element reference on children', () => {
      // Create an editor with the plugin applied, containg a paragraph
      // element with a link element as its child.
      const editor = createEditor([
        {
          ...paragraphElement1,
          children: [
            { text: '' },
            {
              ...linkElement1,
              parents: [
                ResourceReferences.generate(
                  RichTextElements.resource,
                  paragraphElement1.id,
                ),
              ],
            },
            { text: '' },
          ],
        },
      ]);

      // Split the paragraph element so the the link child element
      // ends up in the newly created paragraph element.
      Transforms.splitNodes(editor, {
        at: [0, 1],
      });

      // Get the new paragraph element
      const paragraph = Node.get(editor, [1]) as RTElement;
      // Get the link element from the new paragraph
      const element = Node.get(editor, [1, 1]) as RTElement;

      // The old parent reference
      const oldParentRef = ResourceReferences.generate(
        RichTextElements.resource,
        paragraphElement1.id,
      );
      // The new parent reference
      const newParentRef = ResourceReferences.generate(
        RichTextElements.resource,
        paragraph.id,
      );

      // Link element should no longer contain the old parent's reference
      expect(arrayContainsObject(element.parents, oldParentRef)).toBeFalsy();
      // Link element should contain the new parent's reference
      expect(arrayContainsObject(element.parents, newParentRef)).toBeTruthy();
    });
  });

  describe('merge_node', () => {
    it('updates the parent element reference on children', () => {
      // Create an editor with the plugin applied, containg two paragraph
      // elements, the second with a link element as its child.
      const editor = createEditor([
        paragraphElement1,
        {
          ...paragraphElement2,
          children: [
            { text: '' },
            {
              ...linkElement1,
              parents: [
                ResourceReferences.generate(
                  RichTextElements.resource,
                  paragraphElement2.id,
                ),
              ],
            },
            { text: '' },
          ],
        },
      ]);

      // Merge the paragraph elements
      Transforms.mergeNodes(editor, {
        at: [1],
      });

      // Get the link element
      const element = Node.get(editor, [0, 1]) as RTElement;

      // The old parent reference
      const oldParentRef = ResourceReferences.generate(
        RichTextElements.resource,
        paragraphElement2.id,
      );
      // The new parent reference
      const newParentRef = ResourceReferences.generate(
        RichTextElements.resource,
        paragraphElement1.id,
      );

      // Link element should no longer contain the old parent's reference
      expect(arrayContainsObject(element.parents, oldParentRef)).toBeFalsy();
      // Link element should contain the new parent's reference
      expect(arrayContainsObject(element.parents, newParentRef)).toBeTruthy();
    });
  });
});
