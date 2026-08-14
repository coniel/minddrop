import { HistoryEditor } from 'slate-history';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  titleElement1,
} from '../../../test-utils';
import { setTitleText } from './setTitleText';

const createEditor = () => createTestEditor([titleElement1, paragraphElement1]);

// Counts the total number of operations across all undo history batches
const countUndoableOperations = (editor: ReturnType<typeof createEditor>) =>
  (editor as unknown as HistoryEditor).history.undos.reduce(
    (total, batch) => total + batch.operations.length,
    0,
  );

describe('setTitleText', () => {
  afterEach(cleanup);

  it('replaces the title text', () => {
    const editor = createEditor();

    // Replace the title text
    setTitleText(editor, 'New title');

    // The title should contain the new text
    expect(editor.children[0]).toMatchObject({
      children: [{ text: 'New title' }],
    });
  });

  it('clears the title text when given an empty string', () => {
    const editor = createEditor();

    // Clear the title text
    setTitleText(editor, '');

    // The title should be empty
    expect(editor.children[0]).toMatchObject({
      children: [{ text: '' }],
    });
  });

  it('does not affect the content below the title', () => {
    const editor = createEditor();

    // Replace the title text
    setTitleText(editor, 'New title');

    // The content should remain unchanged
    expect(editor.children[1]).toEqual(paragraphElement1);
  });

  it('records the change in the undo history by default', () => {
    const editor = createEditor();

    // Number of undoable operations before the change
    const operationsBefore = countUndoableOperations(editor);

    // Replace the title text
    setTitleText(editor, 'New title');

    // The change should be recorded in the undo history
    expect(countUndoableOperations(editor)).toBeGreaterThan(operationsBefore);
  });

  it('skips the undo history when saveHistory is false', () => {
    const editor = createEditor();

    // Number of undoable operations before the change
    const operationsBefore = countUndoableOperations(editor);

    // Replace the title text without saving history
    setTitleText(editor, 'New title', { saveHistory: false });

    // The change should not be recorded in the undo history
    expect(countUndoableOperations(editor)).toBe(operationsBefore);
  });
});
