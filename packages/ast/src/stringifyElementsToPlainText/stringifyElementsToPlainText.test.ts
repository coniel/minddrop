import { describe, expect, it } from 'vitest';
import { generateElementTypeConfig } from '../test-utils';
import { generateElement } from '../utils';
import { stringifyElementsToPlainText } from './stringigyElementToPlainText';

const elementConfigWithToPlainText = generateElementTypeConfig(
  'with-to-plain-text',
  {
    toPlainText: () => 'plain text',
  },
);
const elementConfigWithoutToPlainText = generateElementTypeConfig(
  'without-to-plain-text',
);

const configs = [elementConfigWithToPlainText, elementConfigWithoutToPlainText];

describe('stringigyElementToPlainText', () => {
  it('stringifies elements using their `toPlainText` method', () => {
    const element = generateElement('with-to-plain-text');

    const result = stringifyElementsToPlainText(element, configs);

    expect(result).toBe('plain text');
  });

  it('stringifies elements using their children if no `toPlainText` method is provided', () => {
    const element = generateElement('without-to-plain-text', {
      children: [{ text: 'Hello world!' }],
    });

    const result = stringifyElementsToPlainText(element, configs);

    expect(result).toBe('Hello world!');
  });

  it('stringifies elements with other elements as children', () => {
    const element = generateElement('without-to-plain-text', {
      children: [generateElement('with-to-plain-text')],
    });

    const result = stringifyElementsToPlainText(element, configs);

    expect(result).toBe('plain text');
  });

  it('stringifies elements which have no matching config', () => {
    const element = generateElement('foo', {
      children: [{ text: 'Hello world!' }],
    });

    const result = stringifyElementsToPlainText(element, []);

    expect(result).toBe('Hello world!');
  });
});
