import { describe, it, expect } from 'vitest';
import { stringifyBlockElementsToPlainText } from './stringigyBlockElementToPlainText';
import { generateBlockElementConfig } from '../test-utils';
import { generateBlockElement, generateContainerBlockElement } from '../utils';

const elementConfigWithToPlainText = generateBlockElementConfig(
  'with-to-plain-text',
  {
    toPlainText: () => 'plain text',
  },
);
const elementConfigWithoutToPlainText = generateBlockElementConfig(
  'without-to-plain-text',
);

const configs = [elementConfigWithToPlainText, elementConfigWithoutToPlainText];

describe('stringigyBlockElementToPlainText', () => {
  it('stringifies block elements using their `toPlainText` method', () => {
    const element = generateBlockElement('with-to-plain-text');

    const result = stringifyBlockElementsToPlainText(element, configs);

    expect(result).toBe('plain text');
  });

  it('stringifies block elements using their children if no `toPlainText` method is provided', () => {
    const element = generateBlockElement('without-to-plain-text', {
      children: [{ text: 'Hello world!' }],
    });

    const result = stringifyBlockElementsToPlainText(element, configs);

    expect(result).toBe('Hello world!');
  });

  it('stringifies block elements with other block elements as children', () => {
    const element = generateContainerBlockElement('without-to-plain-text', {
      children: [generateBlockElement('with-to-plain-text')],
    });

    const result = stringifyBlockElementsToPlainText(element, configs);

    expect(result).toBe('plain text');
  });

  it('stringifies block elements which have no matching config', () => {
    const element = generateBlockElement('foo', {
      children: [{ text: 'Hello world!' }],
    });

    const result = stringifyBlockElementsToPlainText(element, []);

    expect(result).toBe('Hello world!');
  });
});
