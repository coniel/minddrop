import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, setup } from '../../test-utils';
import {
  blockMathElement1,
  inlineMathElement1,
  paragraphElement1,
} from '../../test-utils/editor.data';
import { createEditor } from './createEditor';

describe('createEditor', () => {
  beforeAll(setup);

  afterAll(cleanup);

  it('configures the `isInline` method', () => {
    // Create an editor
    const editor = createEditor();

    // Check if an InlineElement is an inline element.
    // Should return true.
    expect(editor.isInline(inlineMathElement1)).toBeTruthy();

    // Check if an BlockElement is an inline element.
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
