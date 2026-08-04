import { describe, expect, it } from 'vitest';
import { mapColumnReferences } from './mapColumnReferences';

describe('mapColumnReferences', () => {
  it('converts column values preserving the column structure', () => {
    expect(
      mapColumnReferences(
        { data: { columns: [['entry-1', 'entry-2'], [], ['entry-3']] } },
        (value) => `converted:${value}`,
      ),
    ).toEqual({
      data: {
        columns: [
          ['converted:entry-1', 'converted:entry-2'],
          [],
          ['converted:entry-3'],
        ],
      },
    });
  });

  it('drops values that cannot be converted', () => {
    expect(
      mapColumnReferences(
        { data: { columns: [['entry-1', 'missing']] } },
        (value) => (value === 'missing' ? null : value),
      ),
    ).toEqual({ data: { columns: [['entry-1']] } });
  });

  it('passes options through untouched', () => {
    expect(
      mapColumnReferences(
        { options: { foo: 'bar' }, data: { columns: [['entry-1']] } },
        (value) => value,
      ),
    ).toEqual({ options: { foo: 'bar' }, data: { columns: [['entry-1']] } });
  });

  it('passes configs without columns through unchanged', () => {
    const config = { options: { foo: 'bar' } };

    expect(mapColumnReferences(config, (value) => value)).toBe(config);
  });
});
