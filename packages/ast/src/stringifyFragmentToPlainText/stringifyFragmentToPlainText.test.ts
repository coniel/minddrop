import { describe, it, expect } from 'vitest';
import { stringifyFragmentToPlainText } from './stringifyFragmentToPlainText';
import { Fragment } from '../types';
import { generateInlineElementTypeConfig } from '../test-utils';

const elementConfigWithToPlainText = generateInlineElementTypeConfig(
  'with-to-plain-text',
  {
    toPlainText: () => 'plain text',
  },
);
const elementConfigWithoutToPlainText = generateInlineElementTypeConfig(
  'without-to-plain-text',
);

const configs = [elementConfigWithToPlainText, elementConfigWithoutToPlainText];

describe('stringifyFragmentToPlainText', () => {
  it('stringifies text elements', () => {
    const fragment = [{ text: 'Hello, world!' }];

    expect(stringifyFragmentToPlainText(configs, fragment)).toBe(
      'Hello, world!',
    );
  });

  it('stringifies inline elements using `toPlainText` from config', () => {
    const fragment: Fragment = [
      {
        type: 'with-to-plain-text',
        children: [{ text: 'Hello, world!' }],
      },
    ];

    expect(stringifyFragmentToPlainText(configs, fragment)).toBe('plain text');
  });

  it('stringifies inline elements which do not have `toPlainText` in config', () => {
    const fragment: Fragment = [
      {
        type: 'without-to-plain-text',
        children: [{ text: 'Hello, world!' }],
      },
    ];

    expect(stringifyFragmentToPlainText(configs, fragment)).toBe(
      'Hello, world!',
    );
  });

  it('stringifies nested inline elements', () => {
    const fragment: Fragment = [
      {
        type: 'without-to-plain-text',
        children: [
          {
            type: 'with-to-plain-text',
            children: [{ text: 'Hello, world!' }],
          },
        ],
      },
    ];

    expect(stringifyFragmentToPlainText(configs, fragment)).toBe('plain text');
  });

  it('stringifies inline elements which do not have a config', () => {
    const fragment: Fragment = [
      {
        type: 'missing-config',
        children: [{ text: 'Hello, world!' }],
      },
    ];

    expect(stringifyFragmentToPlainText(configs, fragment)).toBe(
      'Hello, world!',
    );
  });
});
