import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { LinkReferenceElement } from './LinkReferenceElement.types';
import { stringifyLinkReferenceElementToMarkdown } from './stringifyLinkReferenceElementToMarkdown';

describe('stringifyLinkReferenceElementToMarkdown', () => {
  it('stringifies a full reference', () => {
    const element = generateElement<LinkReferenceElement>('link-reference', {
      identifier: 'ref',
      referenceType: 'full',
      children: [{ text: 'Example' }],
    });

    expect(stringifyLinkReferenceElementToMarkdown(element)).toBe(
      '[Example][ref]',
    );
  });

  it('stringifies a collapsed reference', () => {
    const element = generateElement<LinkReferenceElement>('link-reference', {
      identifier: 'ref',
      referenceType: 'collapsed',
      children: [{ text: 'ref' }],
    });

    expect(stringifyLinkReferenceElementToMarkdown(element)).toBe('[ref][]');
  });

  it('stringifies a shortcut reference', () => {
    const element = generateElement<LinkReferenceElement>('link-reference', {
      identifier: 'ref',
      referenceType: 'shortcut',
      children: [{ text: 'ref' }],
    });

    expect(stringifyLinkReferenceElementToMarkdown(element)).toBe('[ref]');
  });

  it('uses the label as authored', () => {
    const element = generateElement<LinkReferenceElement>('link-reference', {
      identifier: 'ref',
      label: 'Ref',
      referenceType: 'full',
      children: [{ text: 'Example' }],
    });

    expect(stringifyLinkReferenceElementToMarkdown(element)).toBe(
      '[Example][Ref]',
    );
  });
});
