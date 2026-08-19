import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DesignFixtures, Designs } from '@minddrop/designs';
import { cleanup, setup } from '../test-utils';
import { flattenTree } from '../utils';
import {
  DesignStudioStore,
  createDesignStudioStore,
} from './DesignStudioStore';

const { design_books, designProperties, layout_card_1, element_text_1 } =
  DesignFixtures;

// The debounce window edits are collected over before a write
const SAVE_DEBOUNCE_MS = 500;

describe('design studio saving', () => {
  let studio: DesignStudioStore;

  beforeEach(() => {
    setup();

    // Fake timers drive the debounce window deterministically
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
   * Reads a persisted element's style out of the stored design.
   */
  function persistedStyle(elementId: string): Record<string, unknown> {
    const layout = Designs.get(design_books.id).layouts.find(
      (candidate) => candidate.id === layout_card_1.id,
    );

    return (flattenTree(layout!.tree)[elementId]?.style ?? {}) as Record<
      string,
      unknown
    >;
  }

  /**
   * Counts writes by observing the design snapshot being refreshed
   * with the persisted design after each one.
   */
  function countWrites(): { count: number } {
    const writes = { count: 0 };

    studio.store.subscribe((state, previous) => {
      if (state.design !== previous.design) {
        writes.count += 1;
      }
    });

    return writes;
  }

  it('defers the write until editing pauses', async () => {
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    // The edit has not reached the store yet
    expect(persistedStyle(element_text_1.id).fontFamily).toBeUndefined();

    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);

    // The edit is persisted once the window elapses
    expect(persistedStyle(element_text_1.id).fontFamily).toBe('mono');
  });

  it('collects a burst of edits into a single write', async () => {
    const writes = countWrites();

    // Three edits inside one debounce window
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');
    studio.updateElementStyle(element_text_1.id, 'fontWeight', 'bold');
    studio.updateElementStyle(element_text_1.id, 'fontSize', 'lg');

    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);

    // The burst wrote once, carrying every edit
    expect(writes.count).toBe(1);
    expect(persistedStyle(element_text_1.id)).toMatchObject({
      fontFamily: 'mono',
      fontWeight: 'bold',
      fontSize: 'lg',
    });
  });

  it('writes again for edits made after the window', async () => {
    const writes = countWrites();

    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);

    studio.updateElementStyle(element_text_1.id, 'fontWeight', 'bold');
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);

    expect(writes.count).toBe(2);
  });

  it('persists a pending edit immediately on flush', async () => {
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    await studio.flushSave();

    // The edit is persisted without waiting out the window
    expect(persistedStyle(element_text_1.id).fontFamily).toBe('mono');
  });

  it('applies overlapping writes in the order they were made', async () => {
    // Start a write, then edit and write again before it settles
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    const first = studio.saveDesign();

    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'serif');

    const second = studio.saveDesign();

    await Promise.all([first, second]);

    // The last write wins
    expect(persistedStyle(element_text_1.id).fontFamily).toBe('serif');
  });

  it('persists pending edits when the studio is cleared', async () => {
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    // Closing the studio drops the state the edit lives in
    studio.clear();

    await studio.flushSave();

    // The edit still reached the store
    expect(persistedStyle(element_text_1.id).fontFamily).toBe('mono');
    expect(studio.isInitialized()).toBe(false);
  });

  it('leaves the cleared store untouched by an in-flight write', async () => {
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    studio.clear();

    await studio.flushSave();

    // The write's result did not resurrect the closed session
    expect(studio.getDesign()).toBeNull();
  });
});
