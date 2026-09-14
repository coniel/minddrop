import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectDatabase, objectEntry1, setup } from '../../test-utils';
import { resolveEntryIcon } from './resolveEntryIcon';

describe('resolveEntryIcon', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("returns the entry's own icon", () => {
    expect(resolveEntryIcon(objectEntry1)).toBe(objectEntry1.properties.Icon);
  });

  it('falls back to the database icon', () => {
    expect(
      resolveEntryIcon({ ...objectEntry1, properties: { Content: 'foo' } }),
    ).toBe(objectDatabase.icon);
  });
});
