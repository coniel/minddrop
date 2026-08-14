import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { LinkElement } from './LinkElement.types';
import { stringifyLinkElementToMarkdown } from './stringifyLinkElementToMarkdown';

describe('stringifyLinkElementToMarkdown', () => {
  it('stringifies a link', () => {
    const element = generateElement<LinkElement>('link', {
      url: 'https://example.com',
      children: [{ text: 'Example' }],
    });

    expect(stringifyLinkElementToMarkdown(element)).toBe(
      '[Example](https://example.com)',
    );
  });

  it('includes the title', () => {
    const element = generateElement<LinkElement>('link', {
      url: 'https://example.com',
      title: 'A site',
      children: [{ text: 'Example' }],
    });

    expect(stringifyLinkElementToMarkdown(element)).toBe(
      '[Example](https://example.com "A site")',
    );
  });

  it('stringifies an autolink', () => {
    const element = generateElement<LinkElement>('link', {
      url: 'https://example.com',
      autolink: true,
      children: [{ text: 'https://example.com' }],
    });

    expect(stringifyLinkElementToMarkdown(element)).toBe(
      '<https://example.com>',
    );
  });
});
