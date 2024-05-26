import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  inlineMathElement1,
  headingElement1,
  paragraphElement1,
  inlineMathElement1PlainText,
  setup,
  cleanup,
  headingElement1PlainText,
  paragraphElement1PlainText,
} from '../test-utils';
import { toPlainText } from './toPlainText';

describe('toPlainText', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('converts the children of non void elements to plain text', () => {
    // Convert to plain text
    const plainText = toPlainText([headingElement1, paragraphElement1]);

    // Should match plain text value
    expect(plainText).toBe(
      `${headingElement1PlainText}\n\n${paragraphElement1PlainText}`,
    );
  });

  it('supports passing in a single element', () => {
    // Convert to plain text
    const plainText = toPlainText(headingElement1);

    // Should match plain text value
    expect(plainText).toBe(headingElement1PlainText);
  });

  it('converts void elements with a toPlainText callback to plain text', () => {
    // Convert to plain text
    const plainText = toPlainText(inlineMathElement1);

    // Should match plain text value
    expect(plainText).toBe(inlineMathElement1PlainText);
  });
});
