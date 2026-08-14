import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '@minddrop/properties';
import { setPropertiesOnMarkdown } from './setPropertiesOnMarkdown';

const schema: PropertiesSchema = [
  {
    type: 'text',
    name: 'title',
  },
  {
    type: 'icon',
    name: 'icon',
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

  it('generates fresh frontmatter when there is no existing content', () => {
    const markdown = `---
foo: bar
---

# Title`;

    expect(setPropertiesOnMarkdown(schema, properties, markdown)).toEqual(
      markdownWithProperties,
    );
  });

  it('omits the frontmatter block when no properties remain', () => {
    expect(setPropertiesOnMarkdown(schema, {}, '# Title')).toEqual('# Title');
  });

  describe('merging into existing content', () => {
    it('preserves keys absent from the schema', () => {
      const result = setPropertiesOnMarkdown(schema, properties, '# Title', {
        existingContent: '---\ntitle: Old\ncustom: keep me\n---\n\n# Title',
      });

      expect(result).toContain('custom: keep me');
      expect(result).toContain('title: Title');
    });

    it('preserves comments', () => {
      const result = setPropertiesOnMarkdown(schema, properties, '# Title', {
        existingContent: '---\n# a comment\ntitle: Old\n---\n\n# Title',
      });

      expect(result).toContain('# a comment');
    });

    it('preserves the formatting of untouched keys', () => {
      const result = setPropertiesOnMarkdown(schema, properties, '# Title', {
        existingContent:
          '---\ntitle: Old\nnotes: |\n  first\n  second\nquoted: "value"\n---\n\n# Title',
      });

      expect(result).toContain('notes: |');
      expect(result).toContain('  first');
      expect(result).toContain('quoted: "value"');
    });

    it('removes a cleared property while keeping its neighbours', () => {
      const result = setPropertiesOnMarkdown(
        schema,
        { title: 'Title' },
        '# Title',
        {
          existingContent:
            '---\ntitle: Old\nicon: content-icon:box:orange\ncustom: keep me\n---\n\n# Title',
        },
      );

      expect(result).not.toContain('icon:');
      expect(result).toContain('custom: keep me');
    });

    it('keeps unmodelled frontmatter when there are no properties', () => {
      const result = setPropertiesOnMarkdown(schema, {}, '# Title', {
        existingContent: '---\ncustom: keep me\n---\n\n# Title',
      });

      expect(result).toContain('custom: keep me');
    });

    it('takes the body from the markdown argument, not the existing content', () => {
      const result = setPropertiesOnMarkdown(
        schema,
        properties,
        '# Updated body',
        { existingContent: '---\ntitle: Old\n---\n\n# Stale body' },
      );

      expect(result).toContain('# Updated body');
      expect(result).not.toContain('# Stale body');
    });

    it('does not mangle a body containing a thematic break', () => {
      const result = setPropertiesOnMarkdown(
        schema,
        properties,
        'One\n\n---\n\nTwo',
        { existingContent: '---\ntitle: Old\n---\n\nOne\n\n---\n\nTwo' },
      );

      expect(result).toEqual(
        `---\ntitle: Title\nicon: ${properties.icon}\n---\n\nOne\n\n---\n\nTwo`,
      );
    });
  });
});
