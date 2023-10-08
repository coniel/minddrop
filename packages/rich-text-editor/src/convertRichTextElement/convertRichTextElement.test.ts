import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { convertRichTextElement } from './convertRichTextElement';
import {
  paragraphElement1,
  paragraphElement1PlainText,
  setup,
} from '../test-utils';
import { cleanup } from '@minddrop/test-utils';

describe('convertRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('with `convert` callback', () => {
    it("uses the new element type's `convert` callback to convert it", () => {
      // Convert a paragraph into a math block
      const converted = convertRichTextElement(paragraphElement1, 'math-block');

      // Should have paragraph text as expression
      expect(converted).toMatchObject({
        expression: paragraphElement1PlainText,
      });
    });
  });

  describe('without `convert` callback', () => {
    it('changes the element type to the new type', () => {
      // Convert a paragraph into a heading
      const converted = convertRichTextElement(paragraphElement1, 'heading-1');

      // Should change type to 'heading-1'
      expect(converted.type).toBe('heading-1');
    });
  });

  it('does nothing if new type is not a registered element type', () => {
    // Convert a paragraph into an unregistered element type
    const converted = convertRichTextElement(paragraphElement1, 'foo');

    // Should maintain paragraph type
    expect(converted).toEqual(paragraphElement1);
  });
});
