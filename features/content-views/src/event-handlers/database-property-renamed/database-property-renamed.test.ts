import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { cleanup, setup } from '../../test-utils';
import { onDatabasePropertyRenamed } from './database-property-renamed';

const { contentView_gallery_1 } = ContentViewFixtures;
const { objectDatabase, historyAction_propertyRenamed } = DatabaseFixtures;

// A view over the fixture database sorted by its 'Content'
// property. Virtual, so that updates skip the file system.
const sortedView = {
  ...contentView_gallery_1,
  id: 'content-view_sorted',
  virtual: true,
  dataSource: { type: 'database' as const, id: objectDatabase.id },
  options: { sortBy: 'property' as const, sortProperty: 'Content' },
};

// A view over the same database sorted by entry metadata. Metadata
// sorts name their target by type rather than by property name.
const metadataSortedView = {
  ...sortedView,
  id: 'content-view_metadata-sorted',
  options: { sortBy: 'metadata' as const, sortProperty: 'Content' },
};

// A view sorted by the same property name over another database
const otherDatabaseView = {
  ...sortedView,
  id: 'content-view_other-database',
  dataSource: { type: 'database' as const, id: 'database_other' },
};

describe('onDatabasePropertyRenamed', () => {
  beforeEach(() => {
    setup();

    // Add the sorted views to the store
    ContentViews.Store.set(sortedView);
    ContentViews.Store.set(metadataSortedView);
    ContentViews.Store.set(otherDatabaseView);
  });

  afterEach(cleanup);

  it('writes the new name to the views sorted by the property', async () => {
    await onDatabasePropertyRenamed({
      original: objectDatabase,
      updated: objectDatabase,
      oldName: 'Content',
      newName: 'Body',
      action: historyAction_propertyRenamed,
    });

    // The sort property should follow the rename
    expect(ContentViews.get(sortedView.id).options).toMatchObject({
      sortProperty: 'Body',
    });
  });

  it('leaves metadata sorts alone', async () => {
    await onDatabasePropertyRenamed({
      original: objectDatabase,
      updated: objectDatabase,
      oldName: 'Content',
      newName: 'Body',
      action: historyAction_propertyRenamed,
    });

    // Metadata sorts name their target by type, so the matching
    // name is not the renamed property.
    expect(ContentViews.get(metadataSortedView.id).options).toMatchObject({
      sortProperty: 'Content',
    });
  });

  it("leaves other databases' views alone", async () => {
    await onDatabasePropertyRenamed({
      original: objectDatabase,
      updated: objectDatabase,
      oldName: 'Content',
      newName: 'Body',
      action: historyAction_propertyRenamed,
    });

    // The other database has a property of its own under that name
    expect(ContentViews.get(otherDatabaseView.id).options).toMatchObject({
      sortProperty: 'Content',
    });
  });
});
