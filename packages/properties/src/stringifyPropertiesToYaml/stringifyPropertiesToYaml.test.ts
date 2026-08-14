import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '../types';
import { stringifyPropertiesToYaml } from './stringifyPropertiesToYaml';

describe('stringifyPropertiesToYaml', () => {
  it('stringifies properties according to the schema', () => {
    const schema: PropertiesSchema = [
      {
        type: 'text',
        name: 'Title',
      },
    ];

    const properties = {
      title: 'Test Title',
    };

    const result = stringifyPropertiesToYaml(schema, properties);

    expect(result).toBe('title: Test Title\n');
  });

  it('writes properties in the order of the schema', () => {
    const schema: PropertiesSchema = [
      { type: 'text', name: 'Title' },
      { type: 'number', name: 'Count' },
    ];

    const result = stringifyPropertiesToYaml(schema, {
      Count: 1,
      Title: 'Test Title',
    });

    expect(result).toBe('Title: Test Title\nCount: 1\n');
  });

  it('writes properties absent from the schema last', () => {
    const schema: PropertiesSchema = [{ type: 'text', name: 'Title' }];

    const result = stringifyPropertiesToYaml(schema, {
      custom: 'foreign',
      Title: 'Test Title',
    });

    expect(result).toBe('Title: Test Title\ncustom: foreign\n');
  });
});
