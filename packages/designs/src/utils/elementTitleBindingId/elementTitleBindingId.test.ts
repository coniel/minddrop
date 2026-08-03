import { describe, expect, it } from 'vitest';
import { elementTitleBindingId } from './elementTitleBindingId';

describe('elementTitleBindingId', () => {
  it('returns the element ID with a title suffix', () => {
    expect(elementTitleBindingId('element-1')).toBe('element-1:title');
  });
});
