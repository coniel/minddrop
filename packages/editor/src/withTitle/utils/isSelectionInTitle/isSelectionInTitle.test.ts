import { Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  titleElement1,
} from '../../../test-utils';
import { isSelectionInTitle } from './isSelectionInTitle';

const createEditor = () => createTestEditor([titleElement1, paragraphElement1]);

describe('isSelectionInTitle', () => {
  afterEach(cleanup);

  it('returns false when there is no selection', () => {
    // Create an editor without a selection
    const editor = createEditor();

    expect(isSelectionInTitle(editor)).toBe(false);
  });

  it('returns true when the selection is inside the title', () => {
    const editor = createEditor();

    // Set the selection inside the title
    Transforms.select(editor, { path: [0, 0], offset: 2 });

    expect(isSelectionInTitle(editor)).toBe(true);
  });

  it('returns false when the selection is inside the content', () => {
    const editor = createEditor();

    // Set the selection inside the paragraph
    Transforms.select(editor, { path: [1, 0], offset: 2 });

    expect(isSelectionInTitle(editor)).toBe(false);
  });

  it('returns true when the selection spans the title and content', () => {
    const editor = createEditor();

    // Select from inside the title into the paragraph
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 2 },
      focus: { path: [1, 0], offset: 2 },
    });

    expect(isSelectionInTitle(editor)).toBe(true);
  });
});
