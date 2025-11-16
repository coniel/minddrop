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
});
