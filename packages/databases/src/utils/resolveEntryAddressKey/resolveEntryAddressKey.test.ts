import { describe, expect, it } from 'vitest';
import { objectDatabase, objectEntry1 } from '../../test-utils';
import { resolveEntryAddressKey } from './resolveEntryAddressKey';

describe('resolveEntryAddressKey', () => {
  it("resolves the entry's address, lowercased", () => {
    expect(resolveEntryAddressKey(objectEntry1, objectDatabase)).toBe(
      `${objectDatabase.name}/${objectEntry1.title}`.toLowerCase(),
    );
  });
});
