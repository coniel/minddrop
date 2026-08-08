import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectEntry1, setup, urlEntry1 } from '../test-utils';
import { resolveEntryLayoutOverrides } from './resolveEntryLayoutOverrides';

describe('resolveEntryLayoutOverrides', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('maps entries to their database override', () => {
    expect(
      resolveEntryLayoutOverrides([objectEntry1.id, urlEntry1.id], {
        [objectEntry1.database]: 'layout-1',
        [urlEntry1.database]: 'layout-2',
      }),
    ).toEqual({
      [objectEntry1.id]: 'layout-1',
      [urlEntry1.id]: 'layout-2',
    });
  });

  it('supports object overrides', () => {
    expect(
      resolveEntryLayoutOverrides([objectEntry1.id], {
        [objectEntry1.database]: { listLayoutId: 'layout-1' },
      }),
    ).toEqual({ [objectEntry1.id]: { listLayoutId: 'layout-1' } });
  });

  it('omits entries whose database has no override', () => {
    expect(
      resolveEntryLayoutOverrides([objectEntry1.id, urlEntry1.id], {
        [objectEntry1.database]: 'layout-1',
      }),
    ).toEqual({ [objectEntry1.id]: 'layout-1' });
  });

  it('omits entries which do not exist', () => {
    expect(
      resolveEntryLayoutOverrides(['database-entry_missing'], {
        [objectEntry1.database]: 'layout-1',
      }),
    ).toEqual({});
  });

  it('returns an empty map when there are no overrides', () => {
    expect(resolveEntryLayoutOverrides([objectEntry1.id])).toEqual({});
  });
});
