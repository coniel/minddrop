import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { InlineMathElement } from './InlineMathElement.types';
import { stringifyInlineMathElementToMarkdown } from './stringifyInlineMathElementToMarkdown';

describe('stringifyInlineMathElementToMarkdown', () => {
  it('stringifies inline math', () => {
    const element = generateElement<InlineMathElement>('inline-math', {
      value: 'x = y',
    });

    expect(stringifyInlineMathElementToMarkdown(element)).toBe('$x = y$');
  });
});
