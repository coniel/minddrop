import { Transforms } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  setup,
  titleElement1,
} from '../../../test-utils';
import { selectionSpansTitle } from './selectionSpansTitle';

const createEditor = () => createTestEditor([titleElement1, paragraphElement1]);

describe('selectionSpansTitle', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns false when there is no selection', () => {
    // Create an editor without a selection
    const editor = createEditor();

    expect(selectionSpansTitle(editor)).toBe(false);
  });

  it('returns false when the selection is contained in the title', () => {
    const editor = createEditor();

    // Set the selection inside the title
    Transforms.select(editor, { path: [0, 0], offset: 2 });

    expect(selectionSpansTitle(editor)).toBe(false);
  });

  it('returns true when the selection spans the title and content', () => {
    const editor = createEditor();

    // Select from inside the title into the paragraph
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 2 },
      focus: { path: [1, 0], offset: 2 },
    });

    expect(selectionSpansTitle(editor)).toBe(true);
  });

  it('returns true for backward selections spanning the title', () => {
    const editor = createEditor();

    // Select from inside the paragraph back into the title
    Transforms.select(editor, {
      anchor: { path: [1, 0], offset: 2 },
      focus: { path: [0, 0], offset: 2 },
    });

    expect(selectionSpansTitle(editor)).toBe(true);
  });
});
