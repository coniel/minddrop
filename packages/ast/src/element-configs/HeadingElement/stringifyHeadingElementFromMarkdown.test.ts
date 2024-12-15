import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { HeadingElement } from './HeadingElement.types';
import { stringifyHeadingElementToMarkdown } from './stringifyHeadingElementFromMarkdown';

describe('stringifyHeadingElementToMarkdown', () => {
  it('stringifies heading elements to the appropriate level', () => {
    new Array(6).fill(null).forEach((_, index) => {
      const level = (index + 1) as HeadingElement['level'];

      const element = generateElement<HeadingElement>('heading', {
        level,
        children: [{ text: `Heading ${level}` }],
      });

      expect(stringifyHeadingElementToMarkdown(element)).toBe(
        `${'#'.repeat(level)} Heading ${level}`,
      );
    });
  });

  it('stringifies level 1 heading elements with alternative syntax', () => {
    const element = generateElement<HeadingElement>('heading', {
      level: 1,
      syntax: '#',
      children: [{ text: 'Heading 1' }],
    });

    // Number of equals signs should match the length of the heading text
    expect(stringifyHeadingElementToMarkdown({ ...element, syntax: '=' })).toBe(
      'Heading 1\n=========',
    );
  });

  it('stringifies level 2 heading elements with alternative syntax', () => {
    const element = generateElement<HeadingElement>('heading', {
      level: 2,
      syntax: '-',
      children: [{ text: 'Heading 2' }],
    });

    // Number of dashes should match the length of the heading text
    expect(stringifyHeadingElementToMarkdown(element)).toBe(
      'Heading 2\n---------',
    );
  });
});
