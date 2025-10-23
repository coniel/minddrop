import { describe, expect, it } from 'vitest';
import { stringifyProperties } from './stringifyProperties';

describe('stringifyProperties', () => {
  it('stringifies properties according to the schema', () => {
    const properties = {
      title: 'Test Title',
    };

    const result = stringifyProperties(properties);

    expect(result).toBe('title: Test Title\n');
  });
});
