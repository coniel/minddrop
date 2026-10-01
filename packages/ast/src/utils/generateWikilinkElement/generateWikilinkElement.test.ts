import { describe, expect, it } from 'vitest';
import { generateWikilinkElement } from './generateWikilinkElement';

describe('generateWikilinkElement', () => {
  it('builds a link with a label', () => {
    expect(generateWikilinkElement('Books/Book', { label: 'Book' })).toEqual({
      type: 'wikilink',
      reference: 'Books/Book',
      children: [{ text: 'Book' }],
    });
  });

  it('builds a link pointing into its target', () => {
    expect(
      generateWikilinkElement('Paper', {
        label: 'a quote',
        fragment: '^abcd1234',
      }),
    ).toEqual({
      type: 'wikilink',
      reference: 'Paper',
      fragment: '^abcd1234',
      children: [{ text: 'a quote' }],
    });
  });

  it('shows the target as the text of a link without a label', () => {
    expect(generateWikilinkElement('Paper', { fragment: 'Chapter 1' })).toEqual(
      {
        type: 'wikilink',
        reference: 'Paper',
        fragment: 'Chapter 1',
        children: [{ text: 'Paper#Chapter 1' }],
      },
    );
  });

  it('keeps an empty label', () => {
    expect(generateWikilinkElement('Paper', { label: '' })).toEqual({
      type: 'wikilink',
      reference: 'Paper',
      children: [{ text: '' }],
    });
  });
});
