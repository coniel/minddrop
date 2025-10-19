import { describe, expect, it } from 'vitest';
import { YAML } from '@minddrop/utils';
import { PropertySchema, PropertyType } from '../types';
import { parseProperties } from './parseProperties';

const schema: PropertySchema[] = [
  { name: 'text', type: PropertyType.Text },
  { name: 'number', type: PropertyType.Number },
  { name: 'checkbox', type: PropertyType.Checkbox },
  { name: 'date', type: PropertyType.Date, format: {}, locale: 'en-US' },
];

const properties = {
  text: 'Sample string',
  number: 42,
  checkbox: true,
  date: new Date('2024-01-01T10:00:00Z'),
};

const stringifiedProperties = YAML.stringify(properties);

describe('parseProperties', () => {
  it('parses properties from a string', () => {
    const parsed = parseProperties(stringifiedProperties, schema);

    expect(parsed).toEqual(properties);
  });

  it('applies default values for missing properties', () => {
    const partialPropertiesString = YAML.stringify({
      text: 'Sample string',
    });

    const schema: PropertySchema[] = [
      { name: 'text', type: PropertyType.Text },
      { name: 'number', type: PropertyType.Number, defaultValue: 10 },
    ];

    const parsed = parseProperties(partialPropertiesString, schema);

    expect(parsed).toEqual({
      text: 'Sample string',
      number: 10,
    });
  });
});
