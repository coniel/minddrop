import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { removeFrontmatter } from './removeFrontmatter';

const markdown = `---
  title: Page
  icon: content-icon:box:orange
---

# Page`;

const markdownMissingNewline = `---
  title: Page
  icon: content-icon:box:orange
---
# Page`;

describe('removeFrontmatter', () => {
  it('removes frontmatter from markdown', () => {
    expect(removeFrontmatter(markdown)).toBe('# Page');
  });

  it('removes frontmatter from markdown missing a second newline after ---', () => {
    expect(removeFrontmatter(markdownMissingNewline)).toBe('# Page');
  });
});
