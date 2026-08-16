import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  cleanup,
  objectEntry1,
  referenceEntry1,
  rootStorageEntry1,
  setup,
} from '../../test-utils';
import { isGloballyUniqueEntryTitle } from './isGloballyUniqueEntryTitle';

describe('isGloballyUniqueEntryTitle', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns true when only one entry has the title', () => {
    expect(isGloballyUniqueEntryTitle(referenceEntry1.title)).toBe(true);
  });

  it('returns true when no entry has the title', () => {
    expect(isGloballyUniqueEntryTitle('No entry has this title')).toBe(true);
  });

  it('returns false when entries in different databases share the title', () => {
    // Several fixture entries are titled the same
    expect(isGloballyUniqueEntryTitle(objectEntry1.title)).toBe(false);
  });

  it('matches titles case-insensitively', () => {
    expect(isGloballyUniqueEntryTitle(objectEntry1.title.toUpperCase())).toBe(
      false,
    );
  });

  it('excludes the given entry from the check', () => {
    // Give a second entry the same title, making it ambiguous
    DatabaseEntriesStore.update(rootStorageEntry1.id, {
      title: referenceEntry1.title,
    });

    expect(isGloballyUniqueEntryTitle(referenceEntry1.title)).toBe(false);

    // Ignoring that entry leaves the title naming only one
    expect(
      isGloballyUniqueEntryTitle(referenceEntry1.title, rootStorageEntry1.id),
    ).toBe(true);
  });
});
