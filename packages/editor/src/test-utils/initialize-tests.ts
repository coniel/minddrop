/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';
import { Selection } from '@minddrop/selection';
import { act, cleanup as cleanupRender } from '@minddrop/test-utils';
import { EditorElementConfigs } from '../EditorElementConfigs';
import { EditorBlockElementConfig } from '../types';

// The element configs the editor ships with, restored after each test
const defaultElementConfigs = [...EditorElementConfigs];

/**
 * Makes an element type available to the editor for the duration of a test.
 * The element set is otherwise fixed, so this exists only to give tests
 * types of their own to act on.
 *
 * @param config - The element config to add.
 */
export function addTestElementConfig(
  config: EditorBlockElementConfig<any>,
): void {
  EditorElementConfigs.push(config);
}

export function cleanup() {
  // React testing library cleanup
  cleanupRender();

  // Drop any element types a test added
  EditorElementConfigs.splice(
    0,
    EditorElementConfigs.length,
    ...defaultElementConfigs,
  );

  act(() => {
    // Clear all mock functions
    vi.clearAllMocks();

    // Clear the app's selection, which block selections take part in
    Selection.clear();
  });
}
