import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '@minddrop/properties';
import { DatabaseEntry } from '../../types';
import { markdownEntrySerializer } from './markdown-entry-serializer';

const schema1: PropertiesSchema = [
  {
    type: 'text-formatted',
    name: 'Content',
  },
];

const entry1: DatabaseEntry = {
  title: 'Test Entry',
  database: 'test-database',
  path: 'test-database/test-entry',
  created: new Date(),
  lastModified: new Date(),
  properties: {
    Content: 'Test content',
  },
};
const schema2: PropertiesSchema = [
  ...schema1,
  {
    type: 'text-formatted',
    name: 'Content 2',
  },
];

const entry2: DatabaseEntry = {
  ...entry1,
  properties: {
    ...entry1.properties,
    'Content 2': 'Test subtitle',
  },
};

const schema3: PropertiesSchema = [
  ...schema1,
  {
    type: 'text',
    name: 'Title',
  },
];

const entry3: DatabaseEntry = {
  ...entry1,
  properties: {
    ...entry1.properties,
    Title: 'Test title',
  },
};

describe('markdown-entry-serializer', () => {
  describe('serialize', () => {
    it('serializes single formatted text property as markdown', () => {
      expect(
        markdownEntrySerializer.serialize(schema1, entry1.properties),
      ).toBe('Test content');
    });

    it('serializes multiple formatted text properties as markdown with headings', () => {
      expect(
        markdownEntrySerializer.serialize(schema2, entry2.properties),
      ).toBe('## Content\n\nTest content\n\n## Content 2\n\nTest subtitle');
    });

    it('adds properties as frontmatter', () => {
      expect(
        markdownEntrySerializer.serialize(schema3, entry3.properties),
      ).toBe('---\nTitle: Test title\n---\n\nTest content');
    });
  });

  describe('deserialize', () => {
    it('deserializes single formatted text property from markdown', () => {
      const serializedEntry = markdownEntrySerializer.serialize(
        schema1,
        entry1.properties,
      );

      expect(
        markdownEntrySerializer.deserialize(schema1, serializedEntry),
      ).toEqual(entry1.properties);
    });

    it('deserializes multiple formatted text properties from markdown', () => {
      const serializedEntry = markdownEntrySerializer.serialize(
        schema2,
        entry2.properties,
      );

      expect(
        markdownEntrySerializer.deserialize(schema2, serializedEntry),
      ).toEqual(entry2.properties);
    });

    it('deserializes frontmatter properties', () => {
      const serializedEntry = markdownEntrySerializer.serialize(
        schema2,
        entry2.properties,
      );

      expect(
        markdownEntrySerializer.deserialize(schema2, serializedEntry),
      ).toEqual(entry2.properties);
    });
  });
});
