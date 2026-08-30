import { afterEach, describe, expect, it } from 'vitest';
import { Selection } from '@minddrop/selection';
import { selectBlocks } from '../selectBlocks';
import {
  cleanup,
  createTestEditorWithBlockIds,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils';
import { clearBlockSelection } from './clearBlockSelection';

// Blocks carry the IDs the app's selection identifies them by
const createEditor = () =>
  createTestEditorWithBlockIds([paragraphElement1, paragraphElement2]);

describe('clearBlockSelection', () => {
  afterEach(cleanup);

  it('removes the editor’s blocks from the app’s selection', () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [1]);
    clearBlockSelection(editor);

    expect(Selection.isEmpty()).toBe(true);
  });

  it('leaves a selection made elsewhere alone', () => {
    const editor = createEditor();

    // A selection which does not belong to the editor
    Selection.select([{ id: 'entry-1', type: 'entry', data: {} }]);
    clearBlockSelection(editor);

    expect(Selection.get()).toHaveLength(1);
  });

  it('leaves another editor’s blocks alone', () => {
    const editor = createEditor();
    const otherEditor = createEditor();

    selectBlocks(otherEditor, [0], [0]);
    clearBlockSelection(editor);

    expect(Selection.get()).toHaveLength(1);
  });
});
