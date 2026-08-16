import { afterEach, describe, expect, it } from 'vitest';
import {
  BlockquoteFrame,
  Element,
  HeadingElement,
  ListItemFrame,
  ParagraphElement,
} from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  headingElement1,
  paragraphElement1,
  paragraphElement1PlainText,
  paragraphElement2,
} from '../test-utils';
import { Editor, IdentifiedElement } from '../types';
import { turnBlocksInto } from './turnBlocksInto';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };
const quote1: BlockquoteFrame = { id: 'quote-1', kind: 'blockquote' };

// Returns the containers a block sits inside as they stand in the editor
function getAncestry(editor: Editor, index: number) {
  return (editor.children[index] as Element).ancestry;
}

describe('turnBlocksInto', () => {
  afterEach(cleanup);

  it('converts the block to the given type', () => {
    const editor = createTestEditor([paragraphElement1]);

    turnBlocksInto(editor, [[0]], 'heading');

    expect(editor.children[0]).toMatchObject({ type: 'heading' });
  });

  it('keeps the block’s text', () => {
    const editor = createTestEditor([paragraphElement1]);

    turnBlocksInto(editor, [[0]], 'heading');

    expect(editor.children[0]).toMatchObject({
      children: [{ text: paragraphElement1PlainText }],
    });
  });

  it('converts several blocks', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    turnBlocksInto(editor, [[0], [1]], 'heading');

    expect(
      editor.children.map((block) => (block as HeadingElement).type),
    ).toEqual(['heading', 'heading']);
  });

  it('applies the given data', () => {
    const editor = createTestEditor([paragraphElement1]);
    const headingData: Partial<HeadingElement> = { level: 2 };

    turnBlocksInto(editor, [[0]], 'heading', headingData);

    expect(editor.children[0]).toMatchObject({ type: 'heading', level: 2 });
  });

  it('drops data belonging to the previous type', () => {
    const editor = createTestEditor([headingElement1]);

    turnBlocksInto(editor, [[0]], 'paragraph');

    expect(editor.children[0]).not.toHaveProperty('level');
  });

  it('keeps the block’s ID', () => {
    const identifiedParagraph: IdentifiedElement<ParagraphElement> = {
      ...paragraphElement1,
      id: 'block-id',
    };
    const editor = createTestEditor([identifiedParagraph]);

    turnBlocksInto(editor, [[0]], 'heading');

    expect(editor.children[0]).toHaveProperty('id', 'block-id');
  });

  it('does nothing when the type is not registered', () => {
    const editor = createTestEditor([paragraphElement1]);

    turnBlocksInto(editor, [[0]], 'unregistered-type');

    expect(editor.children[0]).toMatchObject({ type: 'paragraph' });
  });

  describe('containers', () => {
    it('gives up the list item the new type replaces', () => {
      const editor = createTestEditor([
        { ...paragraphElement1, ancestry: [item1] },
        { ...paragraphElement2, ancestry: [item1, item2] },
      ]);

      turnBlocksInto(editor, [[1]], 'paragraph');

      // Plain text inside the parent item, at the depth it already had
      expect(getAncestry(editor, 1)).toEqual([item1]);
    });

    it('keeps the block in the containers around it', () => {
      const editor = createTestEditor([
        { ...paragraphElement1, ancestry: [quote1] },
      ]);

      turnBlocksInto(editor, [[0]], 'heading');

      expect(getAncestry(editor, 0)).toEqual([quote1]);
    });

    it('gives each converted block a container of its own', () => {
      const editor = createTestEditor([paragraphElement1, paragraphElement2]);
      let built = 0;

      turnBlocksInto(editor, [[0], [1]], 'paragraph', undefined, () => {
        built += 1;

        return { ...item1, id: `item-${built}` };
      });

      // Two blocks converted together become two items rather than one
      expect(getAncestry(editor, 0)?.[0].id).not.toBe(
        getAncestry(editor, 1)?.[0].id,
      );
    });
  });
});
