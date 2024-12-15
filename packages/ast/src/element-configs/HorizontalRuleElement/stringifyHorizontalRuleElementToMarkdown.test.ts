import { describe, it, expect } from 'vitest';
import { generateElement } from '../../utils';
import { stringifyHorizontalRuleElementToMarkdown } from './stringifyHorizontalRuleElementToMarkdown';
import { HorizontalRuleElement } from './HorizontalRuleElement.types';

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
