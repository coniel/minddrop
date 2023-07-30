import { describe, it, expect } from 'vitest';
import { mdastToString } from './mdastToString';
import { parseMarkdown } from '../parseMarkdown';

describe('mdastToString', () => {
  it('returns nodes as a string', () => {
    const node = parseMarkdown('# Title');

    expect(mdastToString(node)).toBe('Title');
  });
});
