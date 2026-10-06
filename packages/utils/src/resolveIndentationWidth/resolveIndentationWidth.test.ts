import { describe, expect, it } from 'vitest';
import { resolveIndentationWidth } from './resolveIndentationWidth';

describe('resolveIndentationWidth', () => {
  it('counts each leading space as one column', () => {
    expect(resolveIndentationWidth('   Text', 4)).toBe(3);
  });

  it('counts a tab to the next multiple of the tab width', () => {
    expect(resolveIndentationWidth('\tText', 4)).toBe(4);
    expect(resolveIndentationWidth('  \tText', 4)).toBe(4);
    expect(resolveIndentationWidth('\t \tText', 4)).toBe(8);
    expect(resolveIndentationWidth(' \tText', 2)).toBe(2);
  });

  it('measures tab stops from the start column', () => {
    expect(resolveIndentationWidth('\tText', 4, 2)).toBe(2);
  });

  it('ignores whitespace after the first other character', () => {
    expect(resolveIndentationWidth('Text   more', 4)).toBe(0);
  });
});
