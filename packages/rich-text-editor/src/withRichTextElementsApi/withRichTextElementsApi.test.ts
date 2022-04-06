import {
  RichTextBlockElement,
  RichTextNode,
  RICH_TEXT_TEST_DATA,
  UpdateRichTextBlockElementData,
} from '@minddrop/rich-text';
import { cleanup, createTestEditor, setup } from '../test-utils';
import { Transforms } from '../Transforms';
import {
  RichTextElementsApi,
  withRichTextElementsApi,
} from './withRichTextElementsApi';

const { paragraphElement1, paragraphElement2, blockEquationElement1 } =
  RICH_TEXT_TEST_DATA;

const emptyParagraph: RichTextBlockElement = {
  ...paragraphElement1,
  children: [{ text: '' }],
};

const api: RichTextElementsApi = {
  createElement: jest.fn(),
  updateElement: jest.fn(),
  deleteElement: jest.fn(),
  setDocumentChildren: jest.fn(),
};

interface BlockEquationElement extends RichTextBlockElement {
  expression: string;
}

describe('withRichTextElements', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('edit text', () => {
    it('updates the parent element children when text is inserted', () => {
      const updateElement = jest.fn();

      // Create an editor with the plugin applied,
      // containg an empty paragraph element.
      const editor = withRichTextElementsApi(
        createTestEditor([emptyParagraph]),
        { ...api, updateElement },
      );

      // Add some text to the start of the paragraph
      Transforms.insertText(editor, 'added text', {
        at: { path: [0, 0], offset: 0 },
      });

      // Should call the supplied API's update function
      expect(updateElement).toHaveBeenCalled();
      // Should call update with the element's ID
      expect(updateElement.mock.calls[0][0]).toBe(paragraphElement1.id);
      // Should call update with the updated children
      const data = updateElement.mock
        .calls[0][1] as UpdateRichTextBlockElementData;
      expect(data.children).toEqual([{ text: 'added text' }]);
    });

    it('updates the parent element children when text is removed', () => {
      const updateElement = jest.fn();

      // Create an editor with the plugin applied,
      // containg a paragraph element.
      const editor = withRichTextElementsApi(
        createTestEditor([paragraphElement1]),
        { ...api, updateElement },
      );

      // Remove the text from the paragraph
      Transforms.delete(editor, {
        unit: 'line',
        at: { path: [0, 0], offset: 0 },
      });

      // Should call `updateElement` with the element's ID
      expect(updateElement.mock.calls[0][0]).toBe(paragraphElement1.id);
      // Should call update with the updated children
      const data = updateElement.mock
        .calls[0][1] as UpdateRichTextBlockElementData;
      expect(data.children).toEqual([{ text: '' }]);
    });
  });

  describe('insert node', () => {
    describe('text node', () => {
      it('updates the parent element children', () => {
        const updateElement = jest.fn();

        // Create an editor with the plugin applied,
        // containg an empty paragraph element.
        const editor = withRichTextElementsApi(
          createTestEditor([emptyParagraph]),
          { ...api, updateElement },
        );

        // Insert a text node into the paragraph
        Transforms.insertNodes(
          editor,
          { text: 'added text' },
          {
            at: { path: [0, 0], offset: 0 },
          },
        );

        // Should call `updateElement` with the element's ID
        expect(updateElement.mock.calls[0][0]).toBe(paragraphElement1.id);
        // Should call `updateElement` with the updated children
        const data = updateElement.mock
          .calls[0][1] as UpdateRichTextBlockElementData;
        expect(data.children).toEqual([{ text: '' }, { text: 'added text' }]);
      });
    });

    describe('element node', () => {
      it('creates an element', () => {
        const createElement = jest.fn();

        // Create an editor with the plugin applied,
        // containg a paragraph element.
        const editor = withRichTextElementsApi(
          createTestEditor([paragraphElement1]),
          { ...api, createElement },
        );

        // Insert a new element
        Transforms.insertNodes(editor, [paragraphElement2], { at: [1] });

        // Should call `createElement` with the new element
        const element = createElement.mock.calls[0][0] as RichTextBlockElement;
        expect(element.id).toEqual(paragraphElement2.id);
      });

      describe('block element', () => {
        it('adds root level elements to the document children', () => {
          const setDocumentChildren = jest.fn();

          // Create an editor with the plugin applied,
          // containg a paragraph element.
          const editor = withRichTextElementsApi(
            createTestEditor([paragraphElement1]),
            { ...api, setDocumentChildren },
          );

          // Insert a new root level element
          Transforms.insertNodes(editor, [paragraphElement2], { at: [1] });

          // Should call `setDocumentChildren` with the updated children
          expect(setDocumentChildren.mock.calls[0][0]).toEqual([
            paragraphElement1.id,
            paragraphElement2.id,
          ]);
        });
      });
    });
  });

  describe('set node', () => {
    describe('text node', () => {
      it('updates the parent element children', () => {
        const updateElement = jest.fn();

        // Create an editor with the plugin applied,
        // containg a paragraph element.
        const editor = withRichTextElementsApi(
          createTestEditor([paragraphElement1]),
          { ...api, updateElement },
        );

        // Apply the 'bold' mark to the text
        Transforms.setNodes(
          editor,
          { bold: true },
          {
            at: [0, 0],
          },
        );

        // Should call `updateElement` with the element's ID
        expect(updateElement.mock.calls[0][0]).toBe(paragraphElement1.id);
        // Should call update with the updated children
        const data = updateElement.mock
          .calls[0][1] as UpdateRichTextBlockElementData;
        expect(data.children).toEqual([
          {
            text: (paragraphElement1.children[0] as RichTextNode).text,
            bold: true,
          },
        ]);
      });
    });

    describe('element node', () => {
      it('updates the element properties', () => {
        const updateElement = jest.fn();

        // Create an editor with the plugin applied,
        // containg a block equation element
        const editor = withRichTextElementsApi(
          createTestEditor([blockEquationElement1]),
          { ...api, updateElement },
        );

        // Update the equation's expression
        Transforms.setNodes<BlockEquationElement>(
          editor,
          { expression: 'F=ma' },
          { at: [0] },
        );

        // Should call `updateElement` with the element's ID
        expect(updateElement.mock.calls[0][0]).toBe(blockEquationElement1.id);
        // Should call update with the updated children
        expect(updateElement.mock.calls[0][1]).toEqual({ expression: 'F=ma' });
      });
    });
  });

  describe('remove node', () => {
    describe('text node', () => {
      it('updates the parent element children', () => {
        const updateElement = jest.fn();

        // Create an editor with the plugin applied, containing
        // a paragraph element with two text nodes.
        const editor = withRichTextElementsApi(
          createTestEditor([
            {
              ...paragraphElement1,
              children: [{ text: 'node 1' }, { text: 'node 2', bold: true }],
            },
          ]),
          { ...api, updateElement },
        );

        // Remove the second text node
        Transforms.removeNodes(editor, { at: [0, 1] });

        // Should call `updateElement` with the element ID
        expect(updateElement.mock.calls[0][0]).toBe(paragraphElement1.id);
        // Should call `updateElement` with the updated children
        expect(updateElement.mock.calls[0][1]).toEqual({
          children: [{ text: 'node 1' }],
        });
      });
    });

    describe('element node', () => {
      it('deletes the element', () => {
        const deleteElement = jest.fn();

        // Create an editor with the plugin applied, containing
        // two paragraph elements.
        const editor = withRichTextElementsApi(
          createTestEditor([paragraphElement1, paragraphElement2]),
          { ...api, deleteElement },
        );

        // Remove the second paragraph
        Transforms.removeNodes(editor, { at: [1] });

        // Should call `deleteElement` with the element ID
        expect(deleteElement.mock.calls[0][0]).toBe(paragraphElement2.id);
      });
    });

    describe('block element', () => {
      it('remove root level element from the document children', () => {
        const setDocumentChildren = jest.fn();

        // Create an editor with the plugin applied,
        // containg two paragraph elements.
        const editor = withRichTextElementsApi(
          createTestEditor([paragraphElement1, paragraphElement2]),
          { ...api, setDocumentChildren },
        );

        // Remove the second paragraph
        Transforms.removeNodes(editor, { at: [1] });

        // Should call `setDocumentChildren` with the updated children
        expect(setDocumentChildren.mock.calls[0][0]).toEqual([
          paragraphElement1.id,
        ]);
      });
    });
  });

  describe('split node', () => {
    it('updates the split element children', () => {
      const updateElement = jest.fn();

      // Create an editor with the plugin applied,
      // containg a paragraph element.
      const editor = withRichTextElementsApi(
        createTestEditor([
          { ...paragraphElement1, children: [{ text: 'onetwo' }] },
        ]),
        { ...api, updateElement },
      );

      // Split the paragraph element between one/two
      Transforms.splitNodes(editor, {
        at: {
          anchor: { path: [0, 0], offset: 3 },
          focus: { path: [0, 0], offset: 3 },
        },
      });

      // Should call `updateElement` with the element ID
      expect(updateElement.mock.calls[0][0]).toBe(paragraphElement1.id);
      // Should call `updateElement` with the updated children
      expect(updateElement.mock.calls[0][1]).toEqual({
        children: [{ text: 'one' }],
      });
    });

    it('creates an element from the second half of the split', () => {
      const createElement = jest.fn();

      // Create an editor with the plugin applied,
      // containg a paragraph element.
      const editor = withRichTextElementsApi(
        createTestEditor([
          { ...paragraphElement1, children: [{ text: 'onetwo' }] },
        ]),
        { ...api, createElement },
      );

      // Split the paragraph element between one/two
      Transforms.splitNodes(editor, {
        at: {
          anchor: { path: [0, 0], offset: 3 },
          focus: { path: [0, 0], offset: 3 },
        },
      });

      // Should call `createElement` with a new element
      const element = createElement.mock.calls[0][0] as RichTextBlockElement;
      // New element should have a new ID
      expect(element.id).not.toBe(paragraphElement1.id);
      // New element should contain the second half of the split children
      expect(element.children).toEqual([{ text: 'two' }]);
    });

    describe('block element', () => {
      it('adds root level elements to the document children', () => {
        const setDocumentChildren = jest.fn();

        // Create an editor with the plugin applied,
        // containg a paragraph element.
        const editor = withRichTextElementsApi(
          createTestEditor([
            { ...paragraphElement1, children: [{ text: 'onetwo' }] },
          ]),
          { ...api, setDocumentChildren },
        );

        // Split the paragraph element between one/two
        Transforms.splitNodes(editor, {
          at: {
            anchor: { path: [0, 0], offset: 3 },
            focus: { path: [0, 0], offset: 3 },
          },
        });

        // Should call `setDocumentChildren` with the added child ID
        expect(setDocumentChildren.mock.calls[0][0].length).toBe(2);
      });
    });
  });

  describe('merge node', () => {
    describe('element node', () => {
      it('updates the element into which the other was merged', () => {
        const updateElement = jest.fn();

        // Create an editor with the plugin applied,
        // containg two paragraph elements.
        const editor = withRichTextElementsApi(
          createTestEditor([paragraphElement1, paragraphElement2]),
          { ...api, updateElement },
        );

        // Merge the second paragraph element into the first one
        Transforms.mergeNodes(editor, {
          at: [1],
        });

        // Should call `updateElement` with the first element's ID
        expect(updateElement.mock.calls[0][0]).toBe(paragraphElement1.id);
        // Should call `updateElement` with the merged children
        expect(updateElement.mock.calls[0][1]).toEqual({
          children: [
            // The text nodes are seperate as they are merged
            // in a second merge operation.
            ...paragraphElement1.children,
            ...paragraphElement2.children,
          ],
        });
      });

      it('deletes the merged element', () => {
        const deleteElement = jest.fn();

        // Create an editor with the plugin applied,
        // containg two paragraph elements.
        const editor = withRichTextElementsApi(
          createTestEditor([paragraphElement1, paragraphElement2]),
          { ...api, deleteElement },
        );

        // Merge the second paragraph element into the first one
        Transforms.mergeNodes(editor, {
          at: [1],
        });

        // Should call `deleteElement` with the second element's ID
        expect(deleteElement.mock.calls[0][0]).toBe(paragraphElement2.id);
      });

      describe('block element', () => {
        it('removes root level elements from the document children', () => {
          const setDocumentChildren = jest.fn();

          // Create an editor with the plugin applied,
          // containg a paragraph element.
          const editor = withRichTextElementsApi(
            createTestEditor([paragraphElement1, paragraphElement2]),
            { ...api, setDocumentChildren },
          );

          // Merge the second paragraph into the first one
          Transforms.mergeNodes(editor, {
            at: [1],
          });

          // Should call `setDocumentChildren` with only the first element ID
          expect(setDocumentChildren.mock.calls[0][0]).toEqual([
            paragraphElement1.id,
          ]);
        });
      });
    });

    describe('text node', () => {
      it('updates the parent element children', () => {
        const updateElement = jest.fn();

        // Create an editor with the plugin applied,
        // containg two paragraph elements.
        const editor = withRichTextElementsApi(
          createTestEditor([
            { ...paragraphElement1, children: [{ text: 'one' }] },
            { ...paragraphElement2, children: [{ text: 'two' }] },
          ]),
          { ...api, updateElement },
        );

        // Merge the second paragraph element into the first one.
        // This will cause the text nodes to be merged.
        Transforms.mergeNodes(editor, {
          at: [1],
        });

        // The call to `updateElement` involving the merging of the
        // text nodes is the second call, as the paragraph elements
        // are merged first.
        // Should call `updateElement` with the first element's ID
        expect(updateElement.mock.calls[1][0]).toBe(paragraphElement1.id);
        // Should call `updateElement` with the merged children
        expect(updateElement.mock.calls[1][1]).toEqual({
          children: [{ text: 'onetwo' }],
        });
      });
    });
  });
});
