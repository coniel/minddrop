import React from 'react';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { boldMarkConfig } from '../default-mark-configs';
import {
  setup,
  cleanup,
  createTestEditor,
  paragraphElement1,
} from '../test-utils';
import { Editor, RichTextMarkConfig } from '../types';
import { withMarkHotkeys } from './withMarkHotkeys';

const mockIsHotkey = vi.fn();

const mockKeyboardEvent = {} as React.KeyboardEvent<HTMLDivElement>;

vi.mock('is-hotkey', () => ({ default: () => mockIsHotkey }));

describe('withMarkHotkeys', () => {
  let editor: Editor;

  beforeEach(() => {
    setup();

    // Create an editor containing some content
    editor = createTestEditor([paragraphElement1]);
  });

  afterEach(cleanup);

  it('toggles a mark with specified value on hotkey match', () => {
    vi.spyOn(editor, 'toggleMark');

    // Make `isHotkey` return a match
    mockIsHotkey.mockImplementation(() => true);

    // Create a modified version of the default 'bold' mark
    // config which sets the mark to a string value.
    const stringMark: RichTextMarkConfig = {
      ...boldMarkConfig,
      hotkeys: [{ keys: ['mod', 'B'], value: 'string-value' }],
    };

    // Create an `onKeyDown` handler with the modified bold mark
    const onKeyDown = withMarkHotkeys(editor, [stringMark]);

    // Run the event handler
    onKeyDown(mockKeyboardEvent);

    // Should toggle the 'bold' mark with the string value
    expect(editor.toggleMark).toHaveBeenCalledWith(
      boldMarkConfig.key,
      'string-value',
    );
  });

  it('returns `true` if there was a match', () => {
    // Make `isHotkey` return a match
    mockIsHotkey.mockImplementation(() => true);

    // Create an `onKeyDown` handler with the bold mark
    const onKeyDown = withMarkHotkeys(editor, [boldMarkConfig]);

    // Should return `true`
    expect(onKeyDown(mockKeyboardEvent)).toBe(true);
  });

  it('returns `false` if there was no match', () => {
    // Make `isHotkey` return no match
    mockIsHotkey.mockImplementation(() => false);

    // Create an `onKeyDown` handler with the bold mark
    const onKeyDown = withMarkHotkeys(editor, [boldMarkConfig]);

    // Should return `false`
    expect(onKeyDown(mockKeyboardEvent)).toBe(false);
  });
});
