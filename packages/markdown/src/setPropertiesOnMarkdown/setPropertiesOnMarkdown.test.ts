import { describe, expect, it } from 'vitest';
import { setPropertiesOnMarkdown } from './setPropertiesOnMarkdown';

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
    expect(setPropertiesOnMarkdown('# Title', properties)).toEqual(
      markdownWithProperties,
    );
  });

  it('removes existing frontmatter', () => {
    const markdown = `---
foo: bar
---

# Title`;

    expect(setPropertiesOnMarkdown(markdown, properties)).toEqual(
      markdownWithProperties,
    );
  });
});
