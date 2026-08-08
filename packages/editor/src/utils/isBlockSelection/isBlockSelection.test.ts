import { Editor as SlateEditor } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Transforms } from '../../Transforms';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  setup,
} from '../../test-utils';
import { isBlockSelection } from './isBlockSelection';

describe('isBlockSelection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('is true when blocks are selected', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [1]),
    });

    expect(isBlockSelection(editor)).toBe(true);
  });

  it('is false when text is selected', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: { path: [0, 0], offset: 4 },
    });

    expect(isBlockSelection(editor)).toBe(false);
  });
});
