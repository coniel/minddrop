import {
  RTBlockElement,
  RTNode,
  RICH_TEXT_TEST_DATA,
  UpdateRTElementData,
  RTFragment,
  RTElement,
} from '@minddrop/rich-text';
import { cleanup, createTestEditor, setup } from '../test-utils';
import { Transforms } from '../Transforms';
import { RTElementsApi, withOperations } from './withOperations';

const {
  paragraphElement1,
  paragraphElement2,
  blockEquationElement1,
  paragraphElement1PlainText,
} = RICH_TEXT_TEST_DATA;

const emptyParagraph: RTBlockElement = {
  ...paragraphElement1,
  children: [{ text: '' }],
};

const api: RTElementsApi = {
  createElement: jest
    .fn()
    .mockImplementation((element) => ({ ...element, id: 'new-element' })),
  updateElement: jest.fn(),
  deleteElement: jest.fn(),
  setDocumentChildren: jest.fn(),
};

interface BlockEquationElement extends RTBlockElement {
  expression: string;
}

describe('withRTElements', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('edit text', () => {
    it('updates the parent element children when text is inserted', () => {
      // Create an editor with the plugin applied,
      // containg an empty paragraph element.
      const editor = withOperations(createTestEditor([emptyParagraph]), api);

      // Add some text to the start of the paragraph
      Transforms.insertText(editor, 'added text', {
        at: { path: [0, 0], offset: 0 },
      });

      // Should call the supplied API's update function
      expect(api.updateElement).toHaveBeenCalledWith(paragraphElement1.id, {
        children: [{ text: 'added text' }],
      });
    });

    it('updates the parent element children when text is removed', () => {
      // Create an editor with the plugin applied,
      // containg a paragraph element.
      const editor = withOperations(createTestEditor([paragraphElement1]), api);

      // Remove the text from the paragraph
      Transforms.delete(editor, {
        unit: 'line',
        at: { path: [0, 0], offset: 0 },
      });

      // Should call `updateElement` with the element's ID
      expect(api.updateElement).toHaveBeenCalledWith(paragraphElement1.id, {
        children: [{ text: '' }],
      });
    });
  });

  describe('insert node', () => {
    describe('text node', () => {
      it('updates the parent element children', () => {
        const updateElement = jest.fn();

        // Create an editor with the plugin applied,
        // containg an empty paragraph element.
        const editor = withOperations(createTestEditor([emptyParagraph]), {
          ...api,
          updateElement,
        });

        // Insert a text node into the paragraph
        Transforms.insertNodes(
          editor,
          { text: 'added text' },
          {
            at: { path: [0, 0], offset: 0 },
          },
        );

        // Should call `updateElement` twice (once to insert, again to normalize)
        expect(updateElement).toHaveBeenCalledTimes(2);
        // Should call `updateElement` with the element's ID
        expect(updateElement.mock.calls[1][0]).toBe(paragraphElement1.id);
        // Should call `updateElement` with the updated children
        const data = updateElement.mock.calls[1][1] as UpdateRTElementData;
        expect(data.children).toEqual([{ text: 'added text' }]);
      });
    });

    describe('element node', () => {
      it('creates an element', () => {
        // Create an editor with the plugin applied,
        // containg a paragraph element.
        const editor = withOperations(
          createTestEditor([paragraphElement1]),
          api,
        );

        // Insert a new element
        Transforms.insertNodes(editor, [paragraphElement2], { at: [1] });

        // Should call `createElement` with the new element
        expect(api.createElement).toHaveBeenCalledWith(paragraphElement2);
      });

      describe('block element', () => {
        it('adds root level elements to the document children', () => {
          // Create an editor with the plugin applied,
          // containg a paragraph element.
          const editor = withOperations(
            createTestEditor([paragraphElement1]),
            api,
          );

          // Insert a new root level element
          Transforms.insertNodes(editor, [paragraphElement2], { at: [1] });

          // Should call `setDocumentChildren` with the updated children
          expect(api.setDocumentChildren).toHaveBeenCalledWith([
            paragraphElement1.id,
            'new-element',
          ]);
        });
      });
    });
  });

  describe('set node', () => {
    describe('text node', () => {
      it('updates the parent element children', () => {
        // Create an editor with the plugin applied,
        // containg a paragraph element.
        const editor = withOperations(
          createTestEditor([paragraphElement1]),
          api,
        );

        // Apply the 'bold' mark to the text
        Transforms.setNodes(
          editor,
          { bold: true },
          {
            at: [0, 0],
          },
        );

        // Should call `updateElement` with the updated children
        expect(api.updateElement).toHaveBeenCalledWith(paragraphElement1.id, {
          children: [{ text: paragraphElement1PlainText, bold: true }],
        });
      });
    });

    describe('element node', () => {
      it('updates the element properties', () => {
        // Create an editor with the plugin applied,
        // containg a block equation element
        const editor = withOperations(
          createTestEditor([blockEquationElement1]),
          api,
        );

        // Update the equation's expression
        Transforms.setNodes<BlockEquationElement>(
          editor,
          { expression: 'F=ma' },
          { at: [0] },
        );

        // Should call `updateElement` with the new properties
        expect(api.updateElement).toHaveBeenCalledWith(
          blockEquationElement1.id,
          { expression: 'F=ma' },
        );
      });
    });
  });

  describe('remove node', () => {
    describe('text node', () => {
      it('updates the parent element children', () => {
        // Create an editor with the plugin applied, containing
        // a paragraph element with two text nodes.
        const editor = withOperations(
          createTestEditor([
            {
              ...paragraphElement1,
              children: [{ text: 'node 1' }, { text: 'node 2', bold: true }],
            },
          ]),
          api,
        );

        // Remove the second text node
        Transforms.removeNodes(editor, { at: [0, 1] });

        // Should call `updateElement` with the updated children
        expect(api.updateElement).toHaveBeenCalledWith(paragraphElement1.id, {
          children: [{ text: 'node 1' }],
        });
      });
    });

    describe('element node', () => {
      it('deletes the element', () => {
        // Create an editor with the plugin applied, containing
        // two paragraph elements.
        const editor = withOperations(
          createTestEditor([paragraphElement1, paragraphElement2]),
          api,
        );

        // Remove the second paragraph
        Transforms.removeNodes(editor, { at: [1] });

        // Should call `deleteElement` with the element ID
        expect(api.deleteElement).toHaveBeenCalledWith(paragraphElement2.id);
      });
    });

    describe('block element', () => {
      it('remove root level element from the document children', () => {
        // Create an editor with the plugin applied,
        // containg two paragraph elements.
        const editor = withOperations(
          createTestEditor([paragraphElement1, paragraphElement2]),
          api,
        );

        // Remove the second paragraph
        Transforms.removeNodes(editor, { at: [1] });

        // Should call `setDocumentChildren` with the updated children
        expect(api.setDocumentChildren).toHaveBeenCalledWith([
          paragraphElement1.id,
        ]);
      });
    });
  });

  describe('split node', () => {
    it('updates the split element children', () => {
      // Create an editor with the plugin applied,
      // containg a paragraph element.
      const editor = withOperations(
        createTestEditor([
          { ...paragraphElement1, children: [{ text: 'onetwo' }] },
        ]),
        api,
      );

      // Split the paragraph element between one/two
      Transforms.splitNodes(editor, {
        at: {
          anchor: { path: [0, 0], offset: 3 },
          focus: { path: [0, 0], offset: 3 },
        },
      });

      // Should call `updateElement` with the updated children
      expect(api.updateElement).toHaveBeenCalledWith(paragraphElement1.id, {
        children: [{ text: 'one' }],
      });
    });

    it('creates an element from the second half of the split', () => {
      // Create an editor with the plugin applied,
      // containg a paragraph element.
      const editor = withOperations(
        createTestEditor([
          { ...paragraphElement1, children: [{ text: 'onetwo' }] },
        ]),
        api,
      );

      // Split the paragraph element between one/two
      Transforms.splitNodes(editor, {
        at: {
          anchor: { path: [0, 0], offset: 3 },
          focus: { path: [0, 0], offset: 3 },
        },
      });

      // Get the newly created element
      const element = editor.children[1] as RTElement;

      // New element should have a new ID
      expect(element.id).toBe('new-element');
      // New element should contain the second half of the split children
      expect(element.children).toEqual([{ text: 'two' }]);
    });

    describe('block element', () => {
      it('adds root level elements to the document children', () => {
        // Create an editor with the plugin applied,
        // containg a paragraph element.
        const editor = withOperations(
          createTestEditor([
            { ...paragraphElement1, children: [{ text: 'onetwo' }] },
          ]),
          api,
        );

        // Split the paragraph element between one/two
        Transforms.splitNodes(editor, {
          at: {
            anchor: { path: [0, 0], offset: 3 },
            focus: { path: [0, 0], offset: 3 },
          },
        });

        // Should call `setDocumentChildren` with the added child ID
        expect(api.setDocumentChildren).toHaveBeenCalledWith([
          paragraphElement1.id,
          'new-element',
        ]);
      });
    });
  });

  describe('merge node', () => {
    describe('element node', () => {
      it('updates the element into which the other was merged', () => {
        // Create an editor with the plugin applied,
        // containg two paragraph elements.
        const editor = withOperations(
          createTestEditor([paragraphElement1, paragraphElement2]),
          api,
        );

        // Merge the second paragraph element into the first one
        Transforms.mergeNodes(editor, {
          at: [1],
        });

        // Should call `updateElement` with the updated children
        expect(api.updateElement).toHaveBeenCalledWith(paragraphElement1.id, {
          children: [
            // The text nodes are seperate as they are merged
            // in a second merge operation.
            ...(paragraphElement1.children as RTFragment),
            ...(paragraphElement2.children as RTFragment),
          ],
        });
      });

      it('deletes the merged element', () => {
        // Create an editor with the plugin applied,
        // containg two paragraph elements.
        const editor = withOperations(
          createTestEditor([paragraphElement1, paragraphElement2]),
          api,
        );

        // Merge the second paragraph element into the first one
        Transforms.mergeNodes(editor, {
          at: [1],
        });

        // Should call `deleteElement` with the second element's ID
        expect(api.deleteElement).toHaveBeenCalledWith(paragraphElement2.id);
      });

      describe('block element', () => {
        it('removes root level elements from the document children', () => {
          // Create an editor with the plugin applied,
          // containg a paragraph element.
          const editor = withOperations(
            createTestEditor([paragraphElement1, paragraphElement2]),
            api,
          );

          // Merge the second paragraph into the first one
          Transforms.mergeNodes(editor, {
            at: [1],
          });

          // Should call `setDocumentChildren` with only the first element ID
          expect(api.setDocumentChildren).toHaveBeenCalledWith([
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
        const editor = withOperations(
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
