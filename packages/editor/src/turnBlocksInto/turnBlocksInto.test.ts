import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HeadingElement, ParagraphElement } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  headingElement1,
  paragraphElement1,
  paragraphElement1PlainText,
  paragraphElement2,
  setup,
} from '../test-utils';
import { IdentifiedElement } from '../types';
import { turnBlocksInto } from './turnBlocksInto';

describe('turnBlocksInto', () => {
  beforeEach(setup);

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
});
