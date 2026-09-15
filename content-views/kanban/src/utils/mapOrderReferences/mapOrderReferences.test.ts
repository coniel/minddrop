import { describe, expect, it } from 'vitest';
import { mapOrderReferences } from './mapOrderReferences';

describe('mapOrderReferences', () => {
  it('converts the entry values in each column', () => {
    const config = {
      data: { order: { '': ['entry-1'], Todo: ['entry-2'] } },
    };

    expect(mapOrderReferences(config, (value) => `converted-${value}`)).toEqual(
      {
        data: {
          order: { '': ['converted-entry-1'], Todo: ['converted-entry-2'] },
        },
      },
    );
  });

  it('drops unconvertible values', () => {
    const config = { data: { order: { Todo: ['entry-1', 'entry-2'] } } };

    expect(
      mapOrderReferences(config, (value) =>
        value === 'entry-1' ? value : null,
      ),
    ).toEqual({ data: { order: { Todo: ['entry-1'] } } });
  });

  it('returns configs without an order unchanged', () => {
    const config = { options: { groupBy: 'Status' } };

    expect(mapOrderReferences(config, (value) => value)).toBe(config);
  });
});
