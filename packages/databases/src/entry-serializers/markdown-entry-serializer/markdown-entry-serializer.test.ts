import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '@minddrop/properties';
import { objectEntry1 } from '../../test-utils';
import { markdownEntrySerializer } from './markdown-entry-serializer';

const contentSchema: PropertiesSchema = [
  {
    type: 'content',
    name: 'Content',
  },
];

const contentEntry = {
  ...objectEntry1,
  properties: {
    Content: 'Test content',
  },
};

const mixedSchema: PropertiesSchema = [
  ...contentSchema,
  {
    type: 'text',
    name: 'Title',
  },
];

const mixedEntry = {
  ...contentEntry,
  properties: {
    ...contentEntry.properties,
    Title: 'Test title',
  },
};

const frontmatterOnlySchema: PropertiesSchema = [
  {
    type: 'text',
    name: 'Title',
  },
];

describe('markdown-entry-serializer', () => {
  describe('serialize', () => {
    it('serializes the content property as the markdown body', () => {
      expect(
        markdownEntrySerializer.serialize(
          contentSchema,
          contentEntry.properties,
        ),
      ).toBe('Test content');
    });

    it('adds the other properties as frontmatter', () => {
      expect(
        markdownEntrySerializer.serialize(mixedSchema, mixedEntry.properties),
      ).toBe('---\nTitle: Test title\n---\n\nTest content');
    });

    it('serializes headings in the content as part of the body', () => {
      expect(
        markdownEntrySerializer.serialize(contentSchema, {
          Content: '## Content\n\nTest content',
        }),
      ).toBe('## Content\n\nTest content');
    });

    it('serializes an empty body when the schema has no content property', () => {
      expect(
        markdownEntrySerializer.serialize(frontmatterOnlySchema, {
          Title: 'Test title',
        }),
      ).toBe('---\nTitle: Test title\n---\n\n');
    });
  });

  describe('deserialize', () => {
    it('deserializes the markdown body as the content property', () => {
      const serializedEntry = markdownEntrySerializer.serialize(
        contentSchema,
        contentEntry.properties,
      );

      expect(
        markdownEntrySerializer.deserialize(contentSchema, serializedEntry),
      ).toEqual(contentEntry.properties);
    });

    it('deserializes frontmatter properties', () => {
      const serializedEntry = markdownEntrySerializer.serialize(
        mixedSchema,
        mixedEntry.properties,
      );

      expect(
        markdownEntrySerializer.deserialize(mixedSchema, serializedEntry),
      ).toEqual(mixedEntry.properties);
    });

    it('round trips headings in the content', () => {
      const properties = { Content: '## Content\n\nTest content' };
      const serializedEntry = markdownEntrySerializer.serialize(
        contentSchema,
        properties,
      );

      expect(
        markdownEntrySerializer.deserialize(contentSchema, serializedEntry),
      ).toEqual(properties);
    });

    it('omits the content when the schema has no content property', () => {
      expect(
        markdownEntrySerializer.deserialize(
          frontmatterOnlySchema,
          '---\nTitle: Test title\n---\n\nTest content',
        ),
      ).toEqual({ Title: 'Test title' });
    });
  });
});
