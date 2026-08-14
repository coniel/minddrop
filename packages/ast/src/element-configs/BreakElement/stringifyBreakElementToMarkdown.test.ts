import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { BreakElement } from './BreakElement.types';
import { stringifyBreakElementToMarkdown } from './stringifyBreakElementToMarkdown';

describe('stringifyBreakElementToMarkdown', () => {
  it('defaults to two trailing spaces', () => {
    const element = generateElement<BreakElement>('break');

    expect(stringifyBreakElementToMarkdown(element)).toBe('  \n');
  });

  it('preserves the authored syntax', () => {
    const element = generateElement<BreakElement>('break', { syntax: '\\' });

    expect(stringifyBreakElementToMarkdown(element)).toBe('\\\n');
  });
});
