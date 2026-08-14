import { describe, expect, it } from 'vitest';
import { ImageElement, LinkElement } from '../element-configs';
import { Fragment } from '../types';
import { generateElement } from '../utils';
import { stringifyFragmentToPlainText } from './stringifyFragmentToPlainText';

const imageElement = generateElement<ImageElement>('image', {
  url: 'cat.png',
  alt: 'A cat',
});

describe('stringifyFragmentToPlainText', () => {
  it('stringifies text elements', () => {
    const fragment = [{ text: 'Hello, world!' }];

    expect(stringifyFragmentToPlainText(fragment)).toBe('Hello, world!');
  });

  it('stringifies inline elements using `toPlainText` from config', () => {
    expect(stringifyFragmentToPlainText([imageElement])).toBe('A cat');
  });

  it('stringifies inline elements which do not have `toPlainText` in config', () => {
    const linkElement = generateElement<LinkElement>('link', {
      url: 'https://example.com',
      children: [{ text: 'Hello, world!' }],
    });

    expect(stringifyFragmentToPlainText([linkElement])).toBe('Hello, world!');
  });

  it('stringifies nested inline elements', () => {
    const linkElement = generateElement<LinkElement>('link', {
      url: 'https://example.com',
      children: [imageElement],
    });

    expect(stringifyFragmentToPlainText([linkElement])).toBe('A cat');
  });

  it('stringifies inline elements which do not have a config', () => {
    const fragment: Fragment = [
      generateElement('missing-config', {
        children: [{ text: 'Hello, world!' }],
      }),
    ];

    expect(stringifyFragmentToPlainText(fragment)).toBe('Hello, world!');
  });
});
