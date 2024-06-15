import { describe, it, expect } from 'vitest';
import { generateVoidBlockElement } from '../../utils';
import { stringifyHorizontalRuleElementToMarkdown } from './stringifyHorizontalRuleElementToMarkdown';
import { HorizontalRuleElement } from './HorizontalRuleElement.types';

const horizontalRuleElement = generateVoidBlockElement<HorizontalRuleElement>(
  'horizontal-rule',
  {
    markdown: '***',
  },
);

describe('stringifyHorizontalRuleElementToMarkdown', () => {
  it('stringifies the horizontal-rule element', () => {
    expect(
      stringifyHorizontalRuleElementToMarkdown(horizontalRuleElement),
    ).toBe(horizontalRuleElement.markdown);
  });
});
