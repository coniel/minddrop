import { describe, it, expect } from 'vitest';
import { removeFrontmatter } from './removeFrontmatter';

const markdown = `---
  title: Document
  icon: content-icon:box:orange
---

# Document`;

const markdownMissingNewline = `---
  title: Document
  icon: content-icon:box:orange
---
# Document`;

describe('removeFrontmatter', () => {
  it('removes frontmatter from markdown', () => {
    expect(removeFrontmatter(markdown)).toBe('# Document');
  });

  it('removes frontmatter from markdown missing a second newline after ---', () => {
    expect(removeFrontmatter(markdownMissingNewline)).toBe('# Document');
  });
});
