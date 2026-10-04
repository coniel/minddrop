import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  CollectionFixtures,
  cleanupCollectionFixtures,
  setupCollectionFixtures,
} from '@minddrop/collections/test-utils';
import { ContentViewTypes } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseEntries, Databases, Entry } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { DragAndDrop } from '@minddrop/drag-and-drop';
import {
  DragSource,
  cleanup as cleanupDrag,
  dragAndDrop,
} from '@minddrop/drag-and-drop/test-utils';
import { Properties } from '@minddrop/properties';
import {
  createDataTransfer,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@minddrop/test-utils';
import { DatabaseEntriesDataKey } from '@minddrop/ui-databases';
import { MockFs, cleanup, setup } from '../test-utils';
import { ContentViewRenderer } from './ContentViewRenderer';

const { collection_1 } = CollectionFixtures;
const { contentView_gallery_1, contentViewType_gallery } = ContentViewFixtures;
const { objectDatabase, objectEntry1, urlDatabase, urlEntry1 } =
  DatabaseFixtures;

// A view of the collection, and one of the object database
const collectionView = {
  ...contentView_gallery_1,
  dataSource: { type: 'collection' as const, id: collection_1.id },
};
const databaseView = {
  ...contentView_gallery_1,
  dataSource: { type: 'database' as const, id: objectDatabase.id },
};

// The object database's content property
const contentProperty = objectDatabase.properties.find(Properties.isContent)!;

describe('<ContentViewRenderer />', () => {
  beforeEach(() => {
    setup();
    setupCollectionFixtures(MockFs);
    DatabaseFixtures.setup(MockFs);

    // Register a view type with no drop target of its own
    ContentViewTypes.register(contentViewType_gallery);

    // Send text to the object database by default
    Databases.setContentDefault('text', objectDatabase.id);
  });

  afterEach(async () => {
    cleanupDrag();
    ContentViewTypes.unregister(contentViewType_gallery.type);
    DatabaseFixtures.cleanup();
    cleanupCollectionFixtures();
    await cleanup();
  });

  /**
   * Returns the element covering the rendered view.
   *
   * @returns The view's root element.
   */
  function viewElement(): Element {
    return document.querySelector('.content-view-renderer')!;
  }

  /**
   * Drags the entry onto the element.
   *
   * @param entry - The entry to drag.
   * @param target - The element to drop it on.
   */
  function dropEntry(entry: Entry, target: Element) {
    render(<DragSource data={{ [DatabaseEntriesDataKey]: [entry] }} />);

    dragAndDrop(screen.getByTestId('drag-source'), target);
  }

  /**
   * Checks whether the object database holds an entry with the text.
   *
   * @param text - The entry's content.
   * @returns Whether such an entry exists.
   */
  function hasTextEntry(text: string): boolean {
    return DatabaseEntries.getAll(objectDatabase.id).some(
      (entry) => entry.properties[contentProperty.name] === text,
    );
  }

  describe('entries dropped within the app', () => {
    it('adds an entry dropped on a view of a collection to the collection', async () => {
      render(
        <ContentViewRenderer
          view={collectionView}
          entries={collection_1.items}
        />,
      );

      dropEntry(objectEntry1, viewElement());

      await waitFor(() => {
        expect(Collections.get(collection_1.id).items).toEqual([
          ...collection_1.items,
          objectEntry1.id,
        ]);
      });
    });

    it('adds an entry dropped on the view type’s own drop target', async () => {
      // Register a view type taking entry drops itself
      ContentViewTypes.register({
        ...contentViewType_gallery,
        component: () => <EntryDropTarget id="view-type-target" />,
      });

      render(
        <ContentViewRenderer
          view={collectionView}
          entries={collection_1.items}
        />,
      );

      dropEntry(objectEntry1, screen.getByTestId('view-type-target'));

      await waitFor(() => {
        expect(Collections.get(collection_1.id).items).toContain(
          objectEntry1.id,
        );
      });
    });

    it('ignores entries dropped outside the view', async () => {
      render(
        <>
          <ContentViewRenderer
            view={collectionView}
            entries={collection_1.items}
          />
          <EntryDropTarget id="outside-target" />
        </>,
      );

      dropEntry(objectEntry1, screen.getByTestId('outside-target'));
      await DatabaseEntries.create(urlDatabase.id);

      expect(Collections.get(collection_1.id).items).toEqual(
        collection_1.items,
      );
    });

    it('creates no entry from the text carried along with a dropped entry', async () => {
      render(
        <>
          <ContentViewRenderer view={collectionView} entries={[]} />
          <DragSource
            data={{
              [DatabaseEntriesDataKey]: [objectEntry1],
              'text/plain': 'Hello',
            }}
          />
        </>,
      );

      dragAndDrop(screen.getByTestId('drag-source'), viewElement());
      await DatabaseEntries.create(urlDatabase.id);

      expect(hasTextEntry('Hello')).toBe(false);
    });

    it('writes nothing for an entry already in the collection', async () => {
      // Hold the entry in the collection before the drop
      Collections.Store.load([{ ...collection_1, items: [objectEntry1.id] }]);

      const before = Collections.get(collection_1.id);

      render(
        <ContentViewRenderer
          view={collectionView}
          entries={[objectEntry1.id]}
        />,
      );

      dropEntry(objectEntry1, viewElement());
      await DatabaseEntries.create(urlDatabase.id);

      expect(Collections.get(collection_1.id)).toBe(before);
    });

    it('adds nothing for a drop on a view of a database', async () => {
      // Hold a collection under the database's ID, so a drop which
      // ignored the source type would add to it.
      const collection = { ...collection_1, id: objectDatabase.id };

      Collections.Store.load([collection]);
      render(
        <ContentViewRenderer view={databaseView} entries={[urlEntry1.id]} />,
      );

      dropEntry(objectEntry1, viewElement());
      await DatabaseEntries.create(urlDatabase.id);

      expect(Collections.get(collection.id).items).toEqual(collection.items);
    });

    it('creates no entry from a drag carrying text', async () => {
      render(
        <>
          <ContentViewRenderer view={databaseView} entries={[]} />
          <DragSource data={{ 'text/plain': 'Hello' }} />
        </>,
      );

      dragAndDrop(screen.getByTestId('drag-source'), viewElement());
      await DatabaseEntries.create(urlDatabase.id);

      expect(hasTextEntry('Hello')).toBe(false);
    });
  });

  describe('content dropped from outside the app', () => {
    it('creates entries in the view’s database', async () => {
      render(<ContentViewRenderer view={databaseView} entries={[]} />);

      // Give text no default database, so only the view's database
      // can take it.
      Databases.setContentDefault('text', null);

      fireEvent.drop(viewElement(), {
        dataTransfer: createDataTransfer({ 'text/plain': 'Hello' }),
      });

      await waitFor(() => {
        expect(hasTextEntry('Hello')).toBe(true);
      });
    });

    it('adds entries created from a drop on a view of a collection to it', async () => {
      render(
        <ContentViewRenderer
          view={collectionView}
          entries={collection_1.items}
        />,
      );

      fireEvent.drop(viewElement(), {
        dataTransfer: createDataTransfer({ 'text/plain': 'Hello' }),
      });

      await waitFor(() => {
        expect(Collections.get(collection_1.id).items).toHaveLength(
          collection_1.items.length + 1,
        );
      });

      const createdId = Collections.get(collection_1.id).items.at(-1)!;

      expect(
        DatabaseEntries.get(createdId).properties[contentProperty.name],
      ).toBe('Hello');
    });

    it('keeps the drop from the handlers around the view', () => {
      render(<ContentViewRenderer view={databaseView} entries={[]} />);

      // Drop on the view, reading whether the drop was prevented. A
      // prevented drop never reaches the window's own handler.
      const allowed = fireEvent.drop(viewElement(), {
        dataTransfer: createDataTransfer({ 'text/plain': 'Hello' }),
      });

      expect(allowed).toBe(false);
    });
  });
});

/**
 * Renders a drop target taking entries, found by its ID.
 */
function EntryDropTarget({ id }: { id: string }) {
  const { droppableProps } = DragAndDrop.useDroppable({
    type: id,
    id,
    accepts: [DatabaseEntriesDataKey],
  });

  return <div data-testid={id} {...droppableProps} />;
}
