import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectEntry1, setup } from '../../test-utils';
import { isEntryTitleTaken } from './isEntryTitleTaken';

describe('isEntryTitleTaken', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns true when the title is taken', () => {
    expect(isEntryTitleTaken(objectEntry1.database, objectEntry1.title)).toBe(
      true,
    );
  });

  it('matches titles case-insensitively', () => {
    expect(
      isEntryTitleTaken(
        objectEntry1.database,
        objectEntry1.title.toUpperCase(),
      ),
    ).toBe(true);
  });

  it('excludes the given entry from the check', () => {
    expect(
      isEntryTitleTaken(
        objectEntry1.database,
        objectEntry1.title,
        objectEntry1.id,
      ),
    ).toBe(false);
  });

  it('ignores entries in other databases', () => {
    expect(isEntryTitleTaken('other-database', objectEntry1.title)).toBe(false);
  });

  it('returns false when the title is available', () => {
    expect(isEntryTitleTaken(objectEntry1.database, 'Available Title')).toBe(
      false,
    );
  });
});
