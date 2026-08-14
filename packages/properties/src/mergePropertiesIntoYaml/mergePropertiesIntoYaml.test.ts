import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '../types';
import { mergePropertiesIntoYaml } from './mergePropertiesIntoYaml';

const schema: PropertiesSchema = [
  { type: 'text', name: 'Title' },
  { type: 'number', name: 'Count' },
  { type: 'select', name: 'Tags', options: [] },
  { type: 'date', name: 'Due' },
];

describe('mergePropertiesIntoYaml', () => {
  it('preserves keys absent from the schema', () => {
    const result = mergePropertiesIntoYaml(
      schema,
      { Title: 'Updated' },
      'Title: Original\ncustom: keep me\n',
    );

    expect(result).toContain('custom: keep me');
  });

  it('preserves comments', () => {
    const result = mergePropertiesIntoYaml(
      schema,
      { Title: 'Updated' },
      '# leading comment\nTitle: Original\n',
    );

    expect(result).toContain('# leading comment');
  });

  describe('key order', () => {
    it('orders schema keys by the order of the schema', () => {
      // The file lists the keys in the opposite order to the schema
      const result = mergePropertiesIntoYaml(
        schema,
        { Title: 'Original', Count: 1 },
        'Count: 1\nTitle: Original\n',
      );

      expect(result).toBe('Title: Original\nCount: 1\n');
    });

    it('leaves keys absent from the schema in position', () => {
      const result = mergePropertiesIntoYaml(
        schema,
        { Title: 'Original', Count: 1 },
        'Count: 1\ncustom: foreign\nTitle: Original\n',
      );

      expect(result).toBe('Title: Original\ncustom: foreign\nCount: 1\n');
    });

    it('carries comments and formatting with their key when reordering', () => {
      const result = mergePropertiesIntoYaml(
        schema,
        { Title: 'Original', Count: 1 },
        'Count: 1\n# about the title\nTitle: "Original"\n',
      );

      expect(result).toBe('# about the title\nTitle: "Original"\nCount: 1\n');
    });

    it('keeps a file header comment at the top', () => {
      const result = mergePropertiesIntoYaml(
        schema,
        { Title: 'Original', Count: 1 },
        '# file header\n\nCount: 1\nTitle: Original\n',
      );

      expect(result.startsWith('# file header')).toBe(true);
    });

    it('places a newly added key in its schema position', () => {
      const result = mergePropertiesIntoYaml(
        schema,
        {
          Title: 'Original',
          Count: 2,
          Due: new Date('2024-01-02T03:04:05.000Z'),
        },
        'Title: Original\nDue: 2024-01-02T03:04:05.000Z\n',
      );

      // Count is declared before Due by the schema, so it takes the slot
      // ahead of it rather than being appended
      expect(result.indexOf('Count')).toBeLessThan(result.indexOf('Due'));
    });
  });

  it('preserves block scalars of untouched keys', () => {
    const result = mergePropertiesIntoYaml(
      schema,
      { Title: 'Updated' },
      'Title: Original\nnotes: |\n  first line\n  second line\n',
    );

    expect(result).toContain('notes: |');
    expect(result).toContain('  first line');
  });

  it('preserves the quoting style of untouched keys', () => {
    const result = mergePropertiesIntoYaml(
      schema,
      { Title: 'quoted value', Count: 2 },
      'Title: "quoted value"\nCount: 1\n',
    );

    expect(result).toContain('Title: "quoted value"');
  });

  it('writes changed values', () => {
    const result = mergePropertiesIntoYaml(
      schema,
      { Title: 'Updated' },
      'Title: Original\n',
    );

    expect(result).toContain('Title: Updated');
    expect(result).not.toContain('Original');
  });

  it('adds new keys', () => {
    const result = mergePropertiesIntoYaml(
      schema,
      { Title: 'Original', Count: 3 },
      'Title: Original\n',
    );

    expect(result).toContain('Count: 3');
  });

  it('removes schema keys which the properties no longer carry', () => {
    const result = mergePropertiesIntoYaml(
      schema,
      { Title: 'Original' },
      'Title: Original\nCount: 1\n',
    );

    expect(result).not.toContain('Count');
  });

  it('does not remove keys absent from the schema', () => {
    const result = mergePropertiesIntoYaml(schema, {}, 'custom: keep me\n');

    expect(result).toContain('custom: keep me');
  });

  it('merges into empty YAML', () => {
    const result = mergePropertiesIntoYaml(schema, { Title: 'New' }, '');

    expect(result).toBe('Title: New\n');
  });

  it('leaves an unchanged date untouched', () => {
    const yaml = 'Due: 2024-01-02T03:04:05.000Z\n';

    const result = mergePropertiesIntoYaml(
      schema,
      { Due: new Date('2024-01-02T03:04:05.000Z') },
      yaml,
    );

    expect(result).toBe(yaml);
  });

  it('writes a changed date', () => {
    const result = mergePropertiesIntoYaml(
      schema,
      { Due: new Date('2025-06-07T08:09:10.000Z') },
      'Due: 2024-01-02T03:04:05.000Z\n',
    );

    expect(result).toContain('2025-06-07T08:09:10.000Z');
  });

  it('leaves an unchanged list untouched', () => {
    const yaml = 'Tags:\n  - a\n  - b\n';

    const result = mergePropertiesIntoYaml(schema, { Tags: ['a', 'b'] }, yaml);

    expect(result).toBe(yaml);
  });

  it('writes a changed list', () => {
    const result = mergePropertiesIntoYaml(
      schema,
      { Tags: ['a', 'c'] },
      'Tags:\n  - a\n  - b\n',
    );

    expect(result).toContain('c');
    expect(result).not.toContain('b');
  });
});
