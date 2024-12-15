import { describe, it, expect } from 'vitest';
import { stringifyFragmentToMarkdown } from './stringifyFragmentToMarkdown';
import { Fragment } from '../types';

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
