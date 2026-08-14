import { describe, expect, it } from 'vitest';
import {
  HtmlElement,
  ImageElement,
  ParagraphElement,
} from '../element-configs';
import { generateElement } from '../utils';
import { stringifyElementsToPlainText } from './stringigyElementToPlainText';

describe('stringigyElementToPlainText', () => {
  it('stringifies elements using their `toPlainText` method', () => {
    const element = generateElement<HtmlElement>('html', {
      value: '<div>Hello world!</div>',
    });

    expect(stringifyElementsToPlainText(element)).toBe('');
  });

  it('stringifies elements using their children if no `toPlainText` method is provided', () => {
    const element = generateElement<ParagraphElement>('paragraph', {
      children: [{ text: 'Hello world!' }],
    });

    expect(stringifyElementsToPlainText(element)).toBe('Hello world!');
  });

  it('stringifies an element containing inline elements', () => {
    const element = generateElement<ParagraphElement>('paragraph', {
      children: [
        { text: 'A ' },
        generateElement<ImageElement>('image', {
          url: 'cat.png',
          alt: 'cat',
        }),
      ],
    });

    expect(stringifyElementsToPlainText(element)).toBe('A cat');
  });

  it('separates elements by empty lines', () => {
    const elements = [
      generateElement<ParagraphElement>('paragraph', {
        children: [{ text: 'One' }],
      }),
      generateElement<ParagraphElement>('paragraph', {
        children: [{ text: 'Two' }],
      }),
    ];

    expect(stringifyElementsToPlainText(elements)).toBe('One\n\nTwo');
  });

  it('stringifies elements which have no matching config', () => {
    const element = generateElement('foo', {
      children: [{ text: 'Hello world!' }],
    });

    expect(stringifyElementsToPlainText(element)).toBe('Hello world!');
  });
});
