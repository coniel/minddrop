import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '../../types';
import { renameSchemaProperty } from './renameSchemaProperty';

const schema: PropertiesSchema = [
  { type: 'text', name: 'Notes' },
  { type: 'number', name: 'Count' },
];

describe('renameSchemaProperty', () => {
  it('renames the property in place', () => {
    // Rename the first of the schema's properties
    const renamed = renameSchemaProperty(schema, 'Notes', 'Details');

    // The property should be renamed where it sits, keeping the rest
    // of its schema.
    expect(renamed).toEqual([
      { type: 'text', name: 'Details' },
      { type: 'number', name: 'Count' },
    ]);
  });

  it('leaves the schema alone when it does not declare the property', () => {
    // Rename a property the schema does not declare
    const renamed = renameSchemaProperty(schema, 'Missing', 'Details');

    expect(renamed).toEqual(schema);
  });
});
