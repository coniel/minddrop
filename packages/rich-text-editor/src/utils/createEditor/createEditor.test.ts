import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { cleanup, setup } from '../../test-utils';
import { createEditor } from './createEditor';
import {
  blockMathElement1,
  inlineMathElement1,
  paragraphElement1,
} from '../../test-utils/rich-text-editor.data';

describe('createEditor', () => {
  beforeAll(setup);

  afterAll(cleanup);

  it('configures the `isInline` method', () => {
    // Create an editor
    const editor = createEditor();

    // Check if an RichTextInlineElement is an inline element.
    // Should return true.
    expect(editor.isInline(inlineMathElement1)).toBeTruthy();

    // Check if an RichTextBlockElement is an inline element.
    // Should return false.
    expect(editor.isInline(blockMathElement1)).toBeFalsy();
  });

  it('configures the `isVoid` method', () => {
    // Create an editor
    const editor = createEditor();

    // Check if an void element is void. Should return true.
    expect(editor.isVoid(inlineMathElement1)).toBeTruthy();

    // Check if an non-void element is void, should return false.
    expect(editor.isVoid(paragraphElement1)).toBeFalsy();
  });
});
