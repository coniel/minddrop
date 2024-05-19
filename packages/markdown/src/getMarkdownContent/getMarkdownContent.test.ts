import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { getMarkdownContent } from './getMarkdownContent';

const markdown = `# Page`;

const markdownWithFrontmatter = `---
  title: Page
  icon: content-icon:box:orange
---

${markdown}`;

describe('getMarkdownContent', () => {
  it('returns only the pure markdown content', () => {
    expect(getMarkdownContent(markdownWithFrontmatter)).toBe(markdown);
  });
});
