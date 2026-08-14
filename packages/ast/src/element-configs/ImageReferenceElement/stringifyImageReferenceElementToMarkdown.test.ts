import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { ImageReferenceElement } from './ImageReferenceElement.types';
import { stringifyImageReferenceElementToMarkdown } from './stringifyImageReferenceElementToMarkdown';

describe('stringifyImageReferenceElementToMarkdown', () => {
  it('stringifies a full reference', () => {
    const element = generateElement<ImageReferenceElement>('image-reference', {
      identifier: 'cat',
      alt: 'A cat',
      referenceType: 'full',
    });

    expect(stringifyImageReferenceElementToMarkdown(element)).toBe(
      '![A cat][cat]',
    );
  });

  it('stringifies a collapsed reference', () => {
    const element = generateElement<ImageReferenceElement>('image-reference', {
      identifier: 'cat',
      alt: 'cat',
      referenceType: 'collapsed',
    });

    expect(stringifyImageReferenceElementToMarkdown(element)).toBe('![cat][]');
  });

  it('stringifies a shortcut reference', () => {
    const element = generateElement<ImageReferenceElement>('image-reference', {
      identifier: 'cat',
      alt: 'cat',
      referenceType: 'shortcut',
    });

    expect(stringifyImageReferenceElementToMarkdown(element)).toBe('![cat]');
  });
});
