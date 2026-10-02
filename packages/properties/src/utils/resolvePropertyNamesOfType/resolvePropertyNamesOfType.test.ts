import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '../../types';
import { resolvePropertyNamesOfType } from './resolvePropertyNamesOfType';

const schema: PropertiesSchema = [
  { type: 'text', name: 'Status' },
  { type: 'tags', name: 'Tags' },
  { type: 'tags', name: 'Topics' },
];

describe('resolvePropertyNamesOfType', () => {
  it('returns the names of the properties of the type', () => {
    expect(resolvePropertyNamesOfType(schema, 'tags')).toEqual([
      'Tags',
      'Topics',
    ]);
  });

  it('returns the names of the properties of any of several types', () => {
    expect(resolvePropertyNamesOfType(schema, ['text', 'tags'])).toEqual([
      'Status',
      'Tags',
      'Topics',
    ]);
  });

  it('returns nothing when the schema has no property of the type', () => {
    expect(resolvePropertyNamesOfType(schema, 'number')).toEqual([]);
  });
});
