import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { UnsupportedElement } from './UnsupportedElement.types';
import { stringifyUnsupportedElementToMarkdown } from './stringifyUnsupportedElementToMarkdown';

describe('stringifyUnsupportedElementToMarkdown', () => {
  it('returns the construct source exactly as authored', () => {
    const element = generateElement<UnsupportedElement>('unsupported', {
      value: '<custom-directive foo="bar" />',
    });

    expect(stringifyUnsupportedElementToMarkdown(element)).toBe(
      '<custom-directive foo="bar" />',
    );
  });
});
