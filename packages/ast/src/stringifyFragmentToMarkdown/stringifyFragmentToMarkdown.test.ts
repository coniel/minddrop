import { describe, expect, it } from 'vitest';
import { LinkElement } from '../element-configs';
import { Fragment } from '../types';
import { stringifyFragmentToMarkdown } from './stringifyFragmentToMarkdown';

describe('stringifyFragmentToMarkdown', () => {
  it('stringifies Text nodes with marks', () => {
    const fragment = [{ bold: true, boldSyntax: '__', text: 'Hello, world!' }];

    expect(stringifyFragmentToMarkdown(fragment)).toBe('__Hello, world!__');
  });

  it('stringifies text with nested marks', () => {
    const fragment = [
      {
        bold: true,
        boldSyntax: '__',
        text: 'Hello, ',
      },
      {
        italic: true,
        italicSyntax: '*',
        bold: true,
        boldSyntax: '__',
        text: 'world',
      },
      {
        bold: true,
        boldSyntax: '__',
        text: '!',
      },
    ];

    expect(stringifyFragmentToMarkdown(fragment)).toBe('__Hello, *world*!__');
  });

  it('uses default formatting syntax when not provided', () => {
    const fragment = [{ bold: true, text: 'Hello, world!' }];

    expect(stringifyFragmentToMarkdown(fragment)).toBe('**Hello, world!**');
  });

  it('stringifies unknown InlineElement nodes', () => {
    const fragment: Fragment = [
      {
        type: 'foo',
        children: [{ text: 'Hello, world!' }],
      },
    ];
    expect(stringifyFragmentToMarkdown(fragment)).toBe('Hello, world!');
  });

  it('stringifies LinkElement nodes', () => {
    const fragment: Fragment = [
      {
        type: 'link',
        url: 'https://example.com',
        children: [{ text: 'Hello, world!', italic: true, italicSyntax: '*' }],
      } as LinkElement,
    ];

    expect(stringifyFragmentToMarkdown(fragment)).toBe(
      '[*Hello, world!*](https://example.com)',
    );
  });
});
