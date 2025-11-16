import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '@minddrop/properties';
import { FrontmatterParseError } from '../errors';
import { getPropertiesFromMarkdown } from './getPropertiesFromMarkdown';

const schema: PropertiesSchema = [
  {
    type: 'text',
    name: 'Title',
  },
  {
    type: 'icon',
    name: 'Icon',
  },
];

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
    expect(getPropertiesFromMarkdown(schema, markdown)).toEqual(properties);
  });

  it('it returns empty object when no frontmatter', () => {
    const noFrontmatter = `# Title`;

    expect(getPropertiesFromMarkdown(schema, noFrontmatter)).toEqual({});
  });

  it('throws error when frontmatter is invalid', () => {
    const invalidFrontmatter = `---
  title: Title
  foo
---`;

    expect(() =>
      getPropertiesFromMarkdown(schema, invalidFrontmatter),
    ).toThrowError(FrontmatterParseError);
  });
});
