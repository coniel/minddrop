import { RichTextElement, RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { Transforms } from 'slate';
import { createEditor } from 'slate';
import { withElementIds } from './withElementIds';

const { paragraphElement1 } = RICH_TEXT_TEST_DATA;

describe('withElementIds', () => {
  it('adds an id to new elements', () => {
    // Create an editor with the plugin
    const editor = withElementIds(createEditor());

    // Insert an element without an ID
    Transforms.insertNodes(editor, [
      // @ts-ignore
      { ...paragraphElement1, id: undefined },
    ]);

    // Element should be given an ID
    expect((editor.children[0] as RichTextElement).id).toBeDefined();
  });

  it("does not overwrite an element's existing ID", () => {
    // Create an editor with the plugin
    const editor = withElementIds(createEditor());

    // Insert an element with an ID
    Transforms.insertNodes(editor, [paragraphElement1]);

    // Element should maintain its original ID
    expect((editor.children[0] as RichTextElement).id).toBe(
      paragraphElement1.id,
    );
  });

  it('adds an id to new elements create from a split', () => {
    // Create an editor with the plugin
    const editor = withElementIds(createEditor());

    // Insert an element
    Transforms.insertNodes(editor, [
      {
        ...paragraphElement1,
        id: 'original-element-id',
        children: [{ text: 'Hello world' }],
      },
    ]);

    // Split the element
    Transforms.splitNodes(editor, { at: { path: [0, 0], offset: 5 } });

    const elements = editor.children as RichTextElement[];

    // New element should have an ID
    expect(elements[1].id).toBeDefined();
    // New element's ID should not be the same as the element it was split from
    expect(elements[1].id).not.toBe('original-element-id');
    // Original element should maintain its original ID
    expect(elements[0].id).toBe('original-element-id');
  });
});
