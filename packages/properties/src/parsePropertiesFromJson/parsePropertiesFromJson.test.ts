import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '../types';
import { parsePropertiesFromJson } from './parsePropertiesFromJson';

const schema: PropertiesSchema = [
  {
    type: 'text',
    name: 'Text',
  },
  {
    type: 'number',
    name: 'Number',
  },
  {
    type: 'toggle',
    name: 'Toggle',
  },
  {
    type: 'date',
    name: 'Date',
  },
];

const properties = {
  text: 'Sample string',
  number: 42,
  checkbox: true,
  date: new Date('2024-01-01T10:00:00Z'),
};

const stringifiedProperties = JSON.stringify(properties);

describe('parsePropertiesFromJson', () => {
  it('parses properties from a JSON string', () => {
    const parsed = parsePropertiesFromJson(schema, stringifiedProperties);

    expect(parsed).toEqual(properties);
  });
});
