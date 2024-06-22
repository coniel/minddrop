import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { getMarkdownContent } from './getMarkdownContent';

const markdown = `# Document`;

const markdownWithFrontmatter = `---
  title: Document
  icon: content-icon:box:orange
---

${markdown}`;

describe('getMarkdownContent', () => {
  it('returns only the pure markdown content', () => {
    expect(getMarkdownContent(markdownWithFrontmatter)).toBe(markdown);
  });
});
