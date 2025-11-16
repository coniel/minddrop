import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '../types';
import { stringifyPropertiesToJson } from './stringifyPropertiesToJson';

describe('stringifyPropertiesToJson', () => {
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

    const result = stringifyPropertiesToJson(schema, properties);

    expect(result).toBe('{"title":"Test Title"}');
  });
});
