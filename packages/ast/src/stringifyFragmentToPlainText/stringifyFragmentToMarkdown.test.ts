import { describe, it, expect } from 'vitest';
import { stringifyFragmentToPlainText } from './stringifyFragmentToMarkdown';
import { Fragment } from '../types';
import { generateInlineElementConfig } from '../test-utils';

const elementConfigWithToPlainText = generateInlineElementConfig(
  'with-to-plain-text',
  {
    toPlainText: () => 'plain text',
  },
);
const elementConfigWithoutToPlainText = generateInlineElementConfig(
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
        display: 'inline',
        children: [{ text: 'Hello, world!' }],
      },
    ];

    expect(stringifyFragmentToPlainText(configs, fragment)).toBe('plain text');
  });

  it('stringifies inline elements which do not have `toPlainText` in config', () => {
    const fragment: Fragment = [
      {
        type: 'without-to-plain-text',
        display: 'inline',
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
        display: 'inline',
        children: [
          {
            type: 'with-to-plain-text',
            display: 'inline',
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
        display: 'inline',
        children: [{ text: 'Hello, world!' }],
      },
    ];

    expect(stringifyFragmentToPlainText(configs, fragment)).toBe(
      'Hello, world!',
    );
  });
});
