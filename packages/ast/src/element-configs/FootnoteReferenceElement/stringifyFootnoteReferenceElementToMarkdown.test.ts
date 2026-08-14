import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { FootnoteReferenceElement } from './FootnoteReferenceElement.types';
import { stringifyFootnoteReferenceElementToMarkdown } from './stringifyFootnoteReferenceElementToMarkdown';

describe('stringifyFootnoteReferenceElementToMarkdown', () => {
  it('stringifies a footnote reference', () => {
    const element = generateElement<FootnoteReferenceElement>(
      'footnote-reference',
      { identifier: '1' },
    );

    expect(stringifyFootnoteReferenceElementToMarkdown(element)).toBe('[^1]');
  });

  it('uses the label as authored', () => {
    const element = generateElement<FootnoteReferenceElement>(
      'footnote-reference',
      { identifier: 'note', label: 'Note' },
    );

    expect(stringifyFootnoteReferenceElementToMarkdown(element)).toBe(
      '[^Note]',
    );
  });
});
