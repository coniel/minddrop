import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { HtmlElement } from './HtmlElement.types';
import { stringifyHtmlElementToMarkdown } from './stringifyHtmlElementToMarkdown';

describe('stringifyHtmlElementToMarkdown', () => {
  it('stringifies the raw HTML', () => {
    const element = generateElement<HtmlElement>('html', {
      value: '<div>\n  <span>a</span>\n</div>',
    });

    expect(stringifyHtmlElementToMarkdown(element)).toBe(element.value);
  });
});
