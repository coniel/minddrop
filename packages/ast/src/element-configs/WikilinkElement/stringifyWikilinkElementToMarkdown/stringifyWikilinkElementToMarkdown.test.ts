import { describe, expect, it } from 'vitest';
import { generateWikilinkElement } from '../../../utils';
import { stringifyWikilinkElementToMarkdown } from './stringifyWikilinkElementToMarkdown';

describe('stringifyWikilinkElementToMarkdown', () => {
  it('stringifies a link with a label', () => {
    expect(
      stringifyWikilinkElementToMarkdown(
        generateWikilinkElement('Books/Book', { label: 'Book' }),
      ),
    ).toBe('[[Books/Book|Book]]');
  });

  it('omits a label which is the reference itself', () => {
    // The spelling it was read from, so it is the spelling written back
    expect(
      stringifyWikilinkElementToMarkdown(
        generateWikilinkElement('Books/Book', { label: 'Books/Book' }),
      ),
    ).toBe('[[Books/Book]]');
  });

  it('stringifies a link pointing into its target', () => {
    expect(
      stringifyWikilinkElementToMarkdown(
        generateWikilinkElement('Paper', {
          label: 'a quote',
          fragment: '^abcd1234',
        }),
      ),
    ).toBe('[[Paper#^abcd1234|a quote]]');
  });

  it('omits a label which is the target itself', () => {
    expect(
      stringifyWikilinkElementToMarkdown(
        generateWikilinkElement('Paper', {
          label: 'Paper#Chapter 1',
          fragment: 'Chapter 1',
        }),
      ),
    ).toBe('[[Paper#Chapter 1]]');
  });

  it('stringifies a link whose label has been emptied', () => {
    expect(
      stringifyWikilinkElementToMarkdown(
        generateWikilinkElement('Books/Book', { label: '' }),
      ),
    ).toBe('[[Books/Book]]');
  });
});
