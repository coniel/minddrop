import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '../../types';
import { resolveChangedPropertyNames } from './resolveChangedPropertyNames';

const schema: PropertiesSchema = [
  { type: 'text', name: 'Status' },
  { type: 'tags', name: 'Tags' },
  { type: 'date', name: 'Due' },
  { type: 'created', name: 'Added' },
  { type: 'last-modified', name: 'Edited' },
];

const original = {
  Status: 'Todo',
  Tags: ['work', 'urgent'],
  Due: new Date('2026-10-01'),
  Added: new Date('2026-09-01'),
  Edited: new Date('2026-09-02'),
};

describe('resolveChangedPropertyNames', () => {
  it('returns the names of the properties given a different value', () => {
    expect(
      resolveChangedPropertyNames(schema, original, {
        ...original,
        Status: 'Done',
      }),
    ).toEqual(['Status']);
  });

  it('treats an equal list as unchanged', () => {
    expect(
      resolveChangedPropertyNames(schema, original, {
        ...original,
        Tags: ['work', 'urgent'],
      }),
    ).toEqual([]);
  });

  it('treats an equal date as unchanged', () => {
    expect(
      resolveChangedPropertyNames(schema, original, {
        ...original,
        Due: new Date('2026-10-01'),
      }),
    ).toEqual([]);
  });

  it('returns properties added to the map', () => {
    const { Status, ...withoutStatus } = original;

    expect(
      resolveChangedPropertyNames(schema, withoutStatus, {
        ...withoutStatus,
        Status,
      }),
    ).toEqual(['Status']);
  });

  it('returns properties removed from the map', () => {
    const { Status, ...withoutStatus } = original;

    expect(
      resolveChangedPropertyNames(schema, original, withoutStatus),
    ).toEqual(['Status']);
  });

  it('treats a missing value and null as equal', () => {
    expect(
      resolveChangedPropertyNames(schema, original, {
        ...original,
        Owner: null,
      }),
    ).toEqual([]);
  });

  it('leaves out timestamp properties', () => {
    expect(
      resolveChangedPropertyNames(schema, original, {
        ...original,
        Added: new Date('2026-09-10'),
        Edited: new Date('2026-09-11'),
      }),
    ).toEqual([]);
  });
});
