import { afterEach, describe, expect, it } from 'vitest';
import { Ast, ParagraphElement } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils';
import { IdentifiedElement } from '../types';
import { getBlockAlignedRange } from '../utils';
import { duplicateBlocks } from './duplicateBlocks';

// A block carrying a session scoped block ID
const identifiedParagraph: IdentifiedElement<ParagraphElement> = {
  ...Ast.generateElement<ParagraphElement>('paragraph', {
    children: [{ text: 'Duplicate me' }],
  }),
  id: 'block-id',
};

describe('duplicateBlocks', () => {
  afterEach(cleanup);

  it('inserts the copies below the originals', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    duplicateBlocks(editor, [[0]]);

    expect(editor.children).toEqual([
      paragraphElement1,
      paragraphElement1,
      paragraphElement2,
    ]);
  });

  it('inserts the copies of several blocks below the last of them', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    duplicateBlocks(editor, [[0], [1]]);

    expect(editor.children).toEqual([
      paragraphElement1,
      paragraphElement2,
      paragraphElement1,
      paragraphElement2,
    ]);
  });

  it('leaves the copies without a block ID', () => {
    const editor = createTestEditor([identifiedParagraph]);

    duplicateBlocks(editor, [[0]]);

    expect(editor.children[1]).not.toHaveProperty('id');
  });

  it('selects the copies', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    duplicateBlocks(editor, [[0], [1]]);

    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 2,
      lastIndex: 3,
    });
  });
});
