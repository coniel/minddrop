import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { InlineHtmlElement } from './InlineHtmlElement.types';
import { stringifyInlineHtmlElementToMarkdown } from './stringifyInlineHtmlElementToMarkdown';

describe('stringifyInlineHtmlElementToMarkdown', () => {
  it('stringifies the raw HTML', () => {
    const element = generateElement<InlineHtmlElement>('inline-html', {
      value: '<span>',
    });

    expect(stringifyInlineHtmlElementToMarkdown(element)).toBe('<span>');
  });
});
