import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { HorizontalRuleElement } from './HorizontalRuleElement.types';
import { stringifyHorizontalRuleElementToMarkdown } from './stringifyHorizontalRuleElementToMarkdown';

const horizontalRuleElement = generateElement<HorizontalRuleElement>(
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
