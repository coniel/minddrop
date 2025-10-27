import { describe, expect, it, vi } from 'vitest';
import { PropertySchema } from '../types';
import { generateDefaultProperties } from './generateDefaultProperties';

const schema: PropertySchema[] = [
  { name: 'no-default', type: 'text' },
  { name: 'text', type: 'text', defaultValue: 'Sample string' },
  { name: 'number', type: 'number', defaultValue: 10 },
  { name: 'checkbox', type: 'toggle', defaultValue: false },
  {
    name: 'date',
    type: 'date',
    defaultValue: new Date('2024-01-01T00:00:00Z'),
  },
  { name: 'date-now', type: 'date', defaultValue: 'now' },
  {
    name: 'select',
    type: 'select',
    defaultValue: 'Option 1',
    options: [
      {
        value: 'Option 1',
        color: 'red',
      },
    ],
  },
  {
    name: 'multi-select',
    type: 'multiselect',
    defaultValue: ['Option 1', 'Option 2'],
    options: [
      {
        value: 'Option 1',
        color: 'red',
      },
      {
        value: 'Option 2',
        color: 'blue',
      },
    ],
  },
];

describe('generateDefaultProperties', () => {
  it('does something useful', () => {
    vi.useFakeTimers();
    const now = new Date('2025-06-01T12:00:00Z');
    vi.setSystemTime(now);

    const result = generateDefaultProperties(schema);

    expect(result).toEqual({
      text: 'Sample string',
      number: 10,
      checkbox: false,
      date: new Date('2024-01-01T00:00:00Z'),
      'date-now': now,
      select: 'Option 1',
      'multi-select': ['Option 1', 'Option 2'],
    });
  });

  it('includes existing properties into the result', () => {
    const existingProperties = {
      text: 'Existing string',
      newProperty: 42,
    };

    const result = generateDefaultProperties(schema, existingProperties);

    expect(result).toEqual({
      text: 'Existing string',
      number: 10,
      checkbox: false,
      date: new Date('2024-01-01T00:00:00Z'),
      'date-now': expect.any(Date),
      select: 'Option 1',
      'multi-select': ['Option 1', 'Option 2'],
      newProperty: 42,
    });
  });
});
