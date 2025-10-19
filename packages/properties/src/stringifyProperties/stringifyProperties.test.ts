import { describe, expect, it } from 'vitest';
import { PropertiesSchema, PropertyType } from '../types';
import { stringifyProperties } from './stringifyProperties';

describe('stringifyProperties', () => {
  it('stringifies properties according to the schema', () => {
    const properties = {
      title: 'Test Title',
    };

    const schema: PropertiesSchema = [
      {
        name: 'title',
        type: PropertyType.Text,
      },
    ];

    const result = stringifyProperties(properties, schema);

    expect(result).toBe('title: Test Title\n');
  });

  it('includes default values for missing properties', () => {
    const properties = {
      title: 'Test Title',
    };

    const schema: PropertiesSchema = [
      {
        name: 'title',
        type: PropertyType.Text,
      },
      {
        name: 'description',
        type: PropertyType.Text,
        defaultValue: 'Default Description',
      },
    ];

    const result = stringifyProperties(properties, schema);

    expect(result).toBe(
      'title: Test Title\ndescription: Default Description\n',
    );
  });
});
