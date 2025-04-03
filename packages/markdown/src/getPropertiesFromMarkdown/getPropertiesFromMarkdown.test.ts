import { describe, expect, it } from 'vitest';
import { FrontmatterParseError } from '../errors';
import { getPropertiesFromMarkdown } from './getPropertiesFromMarkdown';

const properties = {
  title: 'Title',
  icon: 'content-icon:box:orange',
};

const markdown = `---
title: ${properties.title}
icon: ${properties.icon}
---

# Title`;

describe('getProperties', () => {
  it('it returns properties from frontmatter', () => {
    expect(getPropertiesFromMarkdown(markdown)).toEqual(properties);
  });

  it('it returns empty object when no frontmatter', () => {
    const noFrontmatter = `# Title`;

    expect(getPropertiesFromMarkdown(noFrontmatter)).toEqual({});
  });

  it('throws error when frontmatter is invalid', () => {
    const invalidFrontmatter = `---
  title: Title
  foo
---`;

    expect(() => getPropertiesFromMarkdown(invalidFrontmatter)).toThrowError(
      FrontmatterParseError,
    );
  });
});
