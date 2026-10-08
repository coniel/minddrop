import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { NotRegisteredError } from '@minddrop/stores';
import { EntriesStore } from '../EntriesStore';
import { EntryNotFoundError } from '../errors';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  relatedEntry1,
  relatedPropertyName,
  setup,
} from '../test-utils';
import {
  embeddedViewConfigKey,
  resolveEntryAddress,
  virtualCollectionId,
  virtualViewId,
} from '../utils';
import { ensureEntryVirtualView } from './ensureEntryVirtualView';

const { contentViewType_gallery, contentViewType_referencing } =
  ContentViewFixtures;

// The virtual collection of the entry's Related property
const collectionId = virtualCollectionId(
  collectionEntry1.id,
  relatedPropertyName,
);

// The ID of the design element embedding the view
const elementId = 'element_related';

describe('ensureEntryVirtualView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the view for the collection, owned by the entry', () => {
    const view = ensureEntryVirtualView(
      collectionId,
      elementId,
      contentViewType_gallery.type,
    );

    expect(ContentViews.Store).toHaveItem(view.id, view);
    expect(view).toMatchObject({
      type: contentViewType_gallery.type,
      dataSource: { type: 'collection', id: collectionId },
      owner: collectionEntry1.id,
      ownerKey: embeddedViewConfigKey(elementId, contentViewType_gallery.type),
      name: relatedPropertyName,
    });
  });

  it('returns the view already created for the element and view type', () => {
    const view = ensureEntryVirtualView(
      collectionId,
      elementId,
      contentViewType_gallery.type,
    );

    // Change the view, which a recreated view would lose
    ContentViews.updateOptions(view.id, { sortProperty: 'Changed' });

    expect(
      ensureEntryVirtualView(
        collectionId,
        elementId,
        contentViewType_gallery.type,
      ).options,
    ).toMatchObject({ sortProperty: 'Changed' });
  });

  it('creates a view per view type', () => {
    const gallery = ensureEntryVirtualView(
      collectionId,
      elementId,
      contentViewType_gallery.type,
    );
    const referencing = ensureEntryVirtualView(
      collectionId,
      elementId,
      contentViewType_referencing.type,
    );

    expect(gallery.id).toBe(
      virtualViewId(collectionId, elementId, contentViewType_gallery.type),
    );
    expect(referencing.id).not.toBe(gallery.id);
  });

  it("applies the config saved in the entry's metadata", () => {
    // Save a config for the element's referencing view. Its items are
    // durable references.
    EntriesStore.set({
      ...collectionEntry1,
      metadata: {
        embeddedViewConfigs: {
          [embeddedViewConfigKey(elementId, contentViewType_referencing.type)]:
            {
              options: { sortProperty: 'Name' },
              data: {
                items: [resolveEntryAddress(relatedEntry1, collectionDatabase)],
              },
            },
        },
      },
    });

    const view = ensureEntryVirtualView(
      collectionId,
      elementId,
      contentViewType_referencing.type,
    );

    // The options should be applied over the type's defaults and the
    // items resolved to entry IDs.
    expect(view.options).toEqual({
      ...contentViewType_referencing.defaultOptions,
      sortProperty: 'Name',
    });
    expect(view.data).toEqual({ items: [relatedEntry1.id] });
  });

  it("throws if the collection's entry does not exist", () => {
    expect(() =>
      ensureEntryVirtualView(
        virtualCollectionId('database-entry_missing', relatedPropertyName),
        elementId,
        contentViewType_gallery.type,
      ),
    ).toThrow(EntryNotFoundError);
  });

  it('throws if the view type is not registered', () => {
    expect(() =>
      ensureEntryVirtualView(collectionId, elementId, 'unregistered'),
    ).toThrow(NotRegisteredError);
  });
});
