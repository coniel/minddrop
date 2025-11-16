import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '@minddrop/properties';
import { setPropertiesOnMarkdown } from './setPropertiesOnMarkdown';

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

const markdownWithProperties = `---
title: ${properties.title}
icon: ${properties.icon}
---

# Title`;

describe('setPropertiesOnMarkdown', () => {
  it('adds properties as frontmatter', () => {
    expect(setPropertiesOnMarkdown(schema, properties, '# Title')).toEqual(
      markdownWithProperties,
    );
  });

  it('removes existing frontmatter', () => {
    const markdown = `---
foo: bar
---

# Title`;

    expect(setPropertiesOnMarkdown(schema, properties, markdown)).toEqual(
      markdownWithProperties,
    );
  });

  it('removes frontmatter if no properties are provided', () => {
    const markdown = `---
  foo: bar
---

# Title`;

    expect(setPropertiesOnMarkdown(schema, {}, markdown)).toEqual('# Title');
  });
});
