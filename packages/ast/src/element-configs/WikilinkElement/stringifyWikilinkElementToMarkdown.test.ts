import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { WikilinkElement } from './WikilinkElement.types';
import { stringifyWikilinkElementToMarkdown } from './stringifyWikilinkElementToMarkdown';

const wikilink = (reference: string, label: string) =>
  generateElement<WikilinkElement>('wikilink', {
    reference,
    children: [{ text: label }],
  });

describe('stringifyWikilinkElementToMarkdown', () => {
  it('stringifies a link with a label', () => {
    expect(
      stringifyWikilinkElementToMarkdown(wikilink('Books/Book', 'Book')),
    ).toBe('[[Books/Book|Book]]');
  });

  it('omits a label which is the reference itself', () => {
    // The spelling it was read from, so it is the spelling written back
    expect(
      stringifyWikilinkElementToMarkdown(wikilink('Books/Book', 'Books/Book')),
    ).toBe('[[Books/Book]]');
  });

  it('stringifies a link whose label has been emptied', () => {
    expect(stringifyWikilinkElementToMarkdown(wikilink('Books/Book', ''))).toBe(
      '[[Books/Book]]',
    );
  });
});
