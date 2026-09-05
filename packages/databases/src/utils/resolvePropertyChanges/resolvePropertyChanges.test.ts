import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '@minddrop/properties';
import { resolvePropertyChanges } from './resolvePropertyChanges';

const schema: PropertiesSchema = [
  { type: 'text', name: 'Status' },
  { type: 'text', name: 'Owner' },
  { type: 'tags', name: 'Tags' },
  { type: 'date', name: 'Due' },
  { type: 'created', name: 'Created' },
  { type: 'last-modified', name: 'Last modified' },
];

describe('resolvePropertyChanges', () => {
  it('returns the properties whose values moved', () => {
    const changes = resolvePropertyChanges(
      schema,
      { Status: 'Planned', Owner: 'Me' },
      { Status: 'Done', Owner: 'Me' },
    );

    expect(changes).toEqual([
      { property: 'Status', from: 'Planned', to: 'Done' },
    ]);
  });

  it('records a property gaining a value', () => {
    const changes = resolvePropertyChanges(schema, {}, { Status: 'Planned' });

    expect(changes).toEqual([
      { property: 'Status', from: null, to: 'Planned' },
    ]);
  });

  it('records a property losing its value', () => {
    const changes = resolvePropertyChanges(schema, { Status: 'Planned' }, {});

    expect(changes).toEqual([
      { property: 'Status', from: 'Planned', to: null },
    ]);
  });

  it('ignores the timestamp properties', () => {
    const changes = resolvePropertyChanges(
      schema,
      {
        Created: new Date('2026-01-01'),
        'Last modified': new Date('2026-01-01'),
      },
      {
        Created: new Date('2026-01-01'),
        'Last modified': new Date('2026-09-01'),
      },
    );

    expect(changes).toEqual([]);
  });

  it('compares dates by their time rather than by identity', () => {
    const changes = resolvePropertyChanges(
      schema,
      { Due: new Date('2026-09-01') },
      { Due: new Date('2026-09-01') },
    );

    expect(changes).toEqual([]);
  });

  it('compares lists by their members', () => {
    const unchanged = resolvePropertyChanges(
      schema,
      { Tags: ['urgent'] },
      { Tags: ['urgent'] },
    );
    const changed = resolvePropertyChanges(
      schema,
      { Tags: ['urgent'] },
      { Tags: ['urgent', 'later'] },
    );

    expect(unchanged).toEqual([]);
    expect(changed).toHaveLength(1);
  });

  it('returns nothing when the update changed no property', () => {
    expect(
      resolvePropertyChanges(schema, { Status: 'Done' }, { Status: 'Done' }),
    ).toEqual([]);
  });
});
