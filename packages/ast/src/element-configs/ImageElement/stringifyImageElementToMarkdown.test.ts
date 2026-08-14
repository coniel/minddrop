import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { ImageElement } from './ImageElement.types';
import { stringifyImageElementToMarkdown } from './stringifyImageElementToMarkdown';

describe('stringifyImageElementToMarkdown', () => {
  it('stringifies an image', () => {
    const element = generateElement<ImageElement>('image', {
      url: 'cat.png',
      alt: 'A cat',
    });

    expect(stringifyImageElementToMarkdown(element)).toBe('![A cat](cat.png)');
  });

  it('stringifies an image with no alt text', () => {
    const element = generateElement<ImageElement>('image', { url: 'cat.png' });

    expect(stringifyImageElementToMarkdown(element)).toBe('![](cat.png)');
  });

  it('includes the title', () => {
    const element = generateElement<ImageElement>('image', {
      url: 'cat.png',
      alt: 'A cat',
      title: 'Mittens',
    });

    expect(stringifyImageElementToMarkdown(element)).toBe(
      '![A cat](cat.png "Mittens")',
    );
  });
});
