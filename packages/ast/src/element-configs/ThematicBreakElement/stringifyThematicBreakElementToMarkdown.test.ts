import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { ThematicBreakElement } from './ThematicBreakElement.types';
import { stringifyThematicBreakElementToMarkdown } from './stringifyThematicBreakElementToMarkdown';

const thematicBreakElement = generateElement<ThematicBreakElement>(
  'thematic-break',
  {
    syntax: '***',
  },
);

describe('stringifyThematicBreakElementToMarkdown', () => {
  it('stringifies the thematic break element', () => {
    expect(stringifyThematicBreakElementToMarkdown(thematicBreakElement)).toBe(
      thematicBreakElement.syntax,
    );
  });
});
