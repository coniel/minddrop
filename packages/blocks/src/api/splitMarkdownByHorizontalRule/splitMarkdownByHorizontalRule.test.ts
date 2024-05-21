import { describe, it, expect } from 'vitest';
import { splitMarkdownByHorizontalRule } from './splitMarkdownByHorizontalRule';

describe('splitMarkdownByHorizontalRule', () => {
  it('should split markdown with single horizontal rule', () => {
    const markdown = `
This is some text above the horizontal rule.

---

This is some text below the horizontal rule.
    `;

    const result = splitMarkdownByHorizontalRule(markdown);

    expect(result).toEqual([
      {
        content: 'This is some text above the horizontal rule.',
        horizontalRule: '---',
      },
      {
        content: 'This is some text below the horizontal rule.',
        horizontalRule: '',
      },
    ]);
  });

  it('should split markdown with multiple horizontal rules', () => {
    const markdown = `
This is some text above the first horizontal rule.

---

This is some text below the first horizontal rule.

***

This is some text below the second horizontal rule.
    `;

    const result = splitMarkdownByHorizontalRule(markdown);

    expect(result).toEqual([
      {
        content: 'This is some text above the first horizontal rule.',
        horizontalRule: '---',
      },
      {
        content: 'This is some text below the first horizontal rule.',
        horizontalRule: '***',
      },
      {
        content: 'This is some text below the second horizontal rule.',
        horizontalRule: '',
      },
    ]);
  });

  it('should handle markdown with no horizontal rules', () => {
    const markdown = `
This is some text without any horizontal rules.
    `;

    const result = splitMarkdownByHorizontalRule(markdown);

    expect(result).toEqual([
      {
        content: 'This is some text without any horizontal rules.',
        horizontalRule: '',
      },
    ]);
  });

  it('should handle markdown with different horizontal rule styles', () => {
    const markdown = `
This is some text above the first horizontal rule.

- - -

This is some text below the first horizontal rule.

* * *

This is some text below the second horizontal rule.
    `;

    const result = splitMarkdownByHorizontalRule(markdown);

    expect(result).toEqual([
      {
        content: 'This is some text above the first horizontal rule.',
        horizontalRule: '- - -',
      },
      {
        content: 'This is some text below the first horizontal rule.',
        horizontalRule: '* * *',
      },
      {
        content: 'This is some text below the second horizontal rule.',
        horizontalRule: '',
      },
    ]);
  });
});
