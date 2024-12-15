import { describe, expect, it } from 'vitest';
import { Fragment } from '../types';
import { stringifyFragmentToMarkdown } from './stringifyFragmentToMarkdown';

describe('stringifyFragmentToMarkdown', () => {
  it('stringifies Text nodes', () => {
    const fragment = [{ text: 'Hello, world!' }];

    expect(stringifyFragmentToMarkdown(fragment)).toBe('Hello, world!');
  });

  it('stringifies InlineElement nodes', () => {
    const fragment: Fragment = [
      {
        type: 'foo',
        children: [{ text: 'Hello, world!' }],
      },
    ];
    expect(stringifyFragmentToMarkdown(fragment)).toBe('Hello, world!');
  });
});
