import { describe, expect, it } from 'vitest';
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

  it('returns the markdown content as is if it does not start with ---', () => {
    expect(removeFrontmatter('\n# Document')).toBe('\n# Document');
  });
});
