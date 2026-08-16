import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { InlineMathElement } from './InlineMathElement.types';
import { stringifyInlineMathElementToMarkdown } from './stringifyInlineMathElementToMarkdown';

describe('stringifyInlineMathElementToMarkdown', () => {
  it('stringifies inline math', () => {
    const element = generateElement<InlineMathElement>('inline-math', {
      children: [{ text: 'x = y' }],
    });

    expect(stringifyInlineMathElementToMarkdown(element)).toBe('$x = y$');
  });

  it('stringifies an empty expression', () => {
    const element = generateElement<InlineMathElement>('inline-math');

    expect(stringifyInlineMathElementToMarkdown(element)).toBe('$$');
  });
});
