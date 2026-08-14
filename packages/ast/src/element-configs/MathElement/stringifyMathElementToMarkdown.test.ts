import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { MathElement } from './MathElement.types';
import { stringifyMathElementToMarkdown } from './stringifyMathElementToMarkdown';

describe('stringifyMathElementToMarkdown', () => {
  it('stringifies a math block', () => {
    const element = generateElement<MathElement>('math', {
      children: [{ text: 'x = y' }],
    });

    expect(stringifyMathElementToMarkdown(element)).toBe('$$\nx = y\n$$');
  });

  it('preserves the meta string', () => {
    const element = generateElement<MathElement>('math', {
      children: [{ text: 'x = y' }],
      meta: 'label',
    });

    expect(stringifyMathElementToMarkdown(element)).toBe('$$label\nx = y\n$$');
  });
});
