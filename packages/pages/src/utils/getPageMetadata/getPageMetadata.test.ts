import { describe, it, expect } from 'vitest';
import { getPageMetadata } from './getPageMetadata';

const markdownFileContent = `---
icon: content-icon:cat:cyan
---

# Title`;

describe('getPageMetadata', () => {
  it('returns page metadata', () => {
    expect(getPageMetadata(markdownFileContent)).toEqual({
      icon: 'content-icon:cat:cyan',
    });
  });

  it('returns empty object if page has no metadata', () => {
    expect(getPageMetadata('')).toEqual({});
  });

  it('returns empty object if page has empty metadata', () => {
    expect(getPageMetadata('---\n---\n')).toEqual({});
  });
});
