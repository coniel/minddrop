import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Designs, TextElementConfig } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup, setup } from '../test-utils';
import { FlatContainerDesignElement, FlatTextElement } from '../types';
import {
  DesignStudioStore,
  createDesignStudioStore,
} from './DesignStudioStore';

const { design_books, designProperties, layout_card_1, element_text_1 } =
  DesignFixtures;

// How long repeated edits to one target stay a single undo step
const COALESCE_WINDOW_MS = 800;

describe('design studio history', () => {
  let studio: DesignStudioStore;

  beforeEach(() => {
    setup();

    // Fake timers freeze the coalesce clock and let it be advanced
    vi.useFakeTimers();

    studio = createDesignStudioStore();
    studio.initialize(design_books, designProperties);
    studio.setActiveLayout(layout_card_1.id);
  });

  afterEach(() => {
    // Drop any save still scheduled by the test
    vi.clearAllTimers();
    vi.useRealTimers();
    cleanup();
  });

  /**
   * Returns the number of steps on the undo stack.
   */
  function undoDepth(): number {
    return studio.store.getState().undoStack.length;
  }

  /**
   * Returns an element's current style in the store.
   */
  function elementStyle(elementId: string): Record<string, unknown> {
    return studio.getDesignElement(elementId).style as Record<string, unknown>;
  }

  it('undoes and redoes an edit', () => {
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    expect(elementStyle(element_text_1.id).fontFamily).toBe('mono');

    studio.undo();

    // The element is back to its unstyled state
    expect(elementStyle(element_text_1.id).fontFamily).toBeUndefined();

    studio.redo();

    // The edit is reapplied
    expect(elementStyle(element_text_1.id).fontFamily).toBe('mono');
  });

  it('reports whether there is anything to undo or redo', () => {
    // A freshly opened design has no history
    expect(studio.canUndo()).toBe(false);
    expect(studio.canRedo()).toBe(false);

    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    expect(studio.canUndo()).toBe(true);
    expect(studio.canRedo()).toBe(false);

    studio.undo();

    expect(studio.canUndo()).toBe(false);
    expect(studio.canRedo()).toBe(true);
  });

  it('collapses repeated edits to the same control into one step', () => {
    // Click through several options of one control
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'serif');
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'sans');

    // The run is a single step
    expect(undoDepth()).toBe(1);

    studio.undo();

    // Undoing returns to before the run began
    expect(elementStyle(element_text_1.id).fontFamily).toBeUndefined();
  });

  it('keeps edits to different controls as separate steps', () => {
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');
    studio.updateElementStyle(element_text_1.id, 'fontWeight', 'bold');

    expect(undoDepth()).toBe(2);

    studio.undo();

    // Only the most recent control is reverted
    expect(elementStyle(element_text_1.id)).toEqual({ fontFamily: 'mono' });
  });

  it('starts a new step once the coalesce window passes', async () => {
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    await vi.advanceTimersByTimeAsync(COALESCE_WINDOW_MS);

    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'serif');

    // The pause separates the two edits
    expect(undoDepth()).toBe(2);

    studio.undo();

    expect(elementStyle(element_text_1.id).fontFamily).toBe('mono');
  });

  it('gives each structural edit its own step', () => {
    // Add two elements and move one of them
    studio.addDesignElementFromTemplate(TextElementConfig.template, 'root', 0);
    studio.addDesignElementFromTemplate(TextElementConfig.template, 'root', 1);

    const root = studio.getDesignElement<FlatContainerDesignElement>('root');

    studio.sortDesignElement(root.children[0], 1);

    expect(undoDepth()).toBe(3);

    // Undoing the sort leaves both added elements in place
    studio.undo();

    expect(
      studio.getDesignElement<FlatContainerDesignElement>('root').children,
    ).toEqual(root.children);
  });

  it('clears the redo stack when a new edit is made', () => {
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');
    studio.undo();

    expect(studio.canRedo()).toBe(true);

    // A fresh edit abandons the undone branch
    studio.updateElementStyle(element_text_1.id, 'fontWeight', 'bold');

    expect(studio.canRedo()).toBe(false);
  });

  it('ignores undo and redo past the ends of the history', () => {
    const styleBefore = elementStyle(element_text_1.id);

    // Nothing recorded yet
    studio.undo();
    studio.redo();

    expect(elementStyle(element_text_1.id)).toEqual(styleBefore);

    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');
    studio.undo();

    // Undoing again does not go back further
    studio.undo();

    expect(elementStyle(element_text_1.id)).toEqual(styleBefore);

    studio.redo();
    studio.redo();

    // Redoing again does not reapply anything else
    expect(elementStyle(element_text_1.id)).toEqual({ fontFamily: 'mono' });
  });

  it('caps the history, dropping the oldest steps', () => {
    const element = studio.getDesignElement<FlatTextElement>(element_text_1.id);

    // Make more edits than the history holds
    for (let revision = 0; revision < 55; revision += 1) {
      studio.setDesignElement(element_text_1.id, {
        ...element,
        content: `Revision ${revision}`,
      });
    }

    expect(undoDepth()).toBe(50);
  });

  it('restores a removed layout', async () => {
    await studio.removeLayout(layout_card_1.id);

    expect(studio.getElementsByLayout()).not.toHaveProperty(layout_card_1.id);

    studio.undo();

    // The layout and its elements are back in the store
    expect(studio.getElementsByLayout()).toHaveProperty(layout_card_1.id);
    expect(
      studio.getDesign()?.layouts.some((l) => l.id === layout_card_1.id),
    ).toBe(true);

    await studio.flushSave();

    // The restore reached the persisted design
    expect(
      Designs.get(design_books.id).layouts.some(
        (layout) => layout.id === layout_card_1.id,
      ),
    ).toBe(true);
  });

  it('leaves untracked design fields alone when undoing', async () => {
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    // Renaming is persisted separately from the layout content
    await studio.renameDesign('Novels');

    studio.undo();

    // The undo reverts the element edit without reverting the name
    expect(elementStyle(element_text_1.id).fontFamily).toBeUndefined();
    expect(studio.getDesign()?.name).toBe('Novels');
  });

  it('resets the history when a design is opened or closed', () => {
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    expect(studio.canUndo()).toBe(true);

    // Reopening a design starts from a clean history
    studio.initialize(design_books, designProperties);

    expect(studio.canUndo()).toBe(false);

    studio.setActiveLayout(layout_card_1.id);
    studio.updateElementStyle(element_text_1.id, 'fontWeight', 'bold');
    studio.clear();

    expect(studio.canUndo()).toBe(false);
  });
});
