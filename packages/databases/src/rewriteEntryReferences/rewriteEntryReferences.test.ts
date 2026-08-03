import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  relatedEntry1,
  setup,
} from '../test-utils';
import { rewriteEntryReferences } from './rewriteEntryReferences';

describe('rewriteEntryReferences', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("rewrites referencing entries' files with current addresses", async () => {
    // Simulate a rename of a referenced entry
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: 'Renamed Related',
      path: `${collectionDatabase.path}/Renamed Related.md`,
    });

    await rewriteEntryReferences([relatedEntry1.id]);

    const contents = MockFs.readTextFile(collectionEntry1.path);

    // The referencing file should contain the new address
    expect(contents).toContain('Collection Database/Renamed Related.md');
    expect(contents).not.toContain('Collection Database/Related Entry 1.md');
  });

  it('does nothing for unreferenced entries', async () => {
    const before = MockFs.readTextFile(collectionEntry1.path);

    await rewriteEntryReferences(['unreferenced-entry']);

    expect(MockFs.readTextFile(collectionEntry1.path)).toBe(before);
  });
});
