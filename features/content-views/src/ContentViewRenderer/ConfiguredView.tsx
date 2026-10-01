import React, { useEffect, useMemo, useRef } from 'react';
import { Collections } from '@minddrop/collections';
import { ContentView, ContentViewTypes } from '@minddrop/content-views';
import { DatabaseEntries } from '@minddrop/databases';
import { DragAndDrop, DropEventData } from '@minddrop/drag-and-drop';
import { Events } from '@minddrop/events';
import { resolveDataSourceDatabaseId } from '@minddrop/ui-content-views';
import {
  DatabaseEntriesDataKey,
  resolveTransferredEntryIds,
} from '@minddrop/ui-databases';
import { TransientViewStateScope } from '@minddrop/ui-primitives';
import { composeRefs } from '@minddrop/utils';
import { useFilteredContentViewEntries } from '../useFilteredContentViewEntries';
import { useSortedContentViewEntries } from '../useSortedContentViewEntries';

// The data types the view takes drops of from drags within the app
const ACCEPTED_DATA_TYPES = [DatabaseEntriesDataKey];

export interface ConfiguredViewProps {
  /**
   * The content view to render.
   */
  view: ContentView;

  /**
   * IDs of the elements to render within the content view.
   */
  entries: string[];
}

/**
 * Renders the content view's type component as the view's drop
 * target.
 */
export const ConfiguredView: React.FC<ConfiguredViewProps> = ({
  view,
  entries,
}) => {
  // The element covering the view
  const elementRef = useRef<HTMLDivElement | null>(null);

  const viewType = ContentViewTypes.use(view.type);

  // Entries matching the view's filters, in the order configured
  // by its sort options.
  const filteredEntries = useFilteredContentViewEntries(view, entries);
  const sortedEntries = useSortedContentViewEntries(view, filteredEntries);

  // Make the whole view a drop target
  const { droppableProps } = DragAndDrop.useDroppable({
    type: 'content-view',
    id: view.id,
    accepts: ACCEPTED_DATA_TYPES,
    nativeAccepts: DatabaseEntries.constants.TransferDataTypes,
    onDrop: handleDrop,
  });

  // Compose the element's ref with the drop target's, as the target
  // registers through its ref callback.
  const elementRefs = useMemo(
    () => composeRefs(elementRef, droppableProps.ref),
    [droppableProps.ref],
  );

  // The collection the view draws from, when its source is one
  const collectionId =
    view.dataSource.type === 'collection' ? view.dataSource.id : null;

  // Add entries dropped within the view to its collection once the
  // drag ends, after the view type has placed them. Entries already
  // in the collection are skipped, so a reorder within the view
  // writes nothing.
  useEffect(() => {
    if (!collectionId) {
      return;
    }

    // The ID the listener is registered under
    const listenerId = `content-view-renderer-${view.id}`;

    // Listen for drags ending in a drop within the view
    Events.addListener(
      DragAndDrop.events.Ended,
      listenerId,
      ({ drag, target }) => {
        // Ignore drags which dropped outside the view
        if (!target || !elementRef.current?.contains(target)) {
          return;
        }

        // Resolve the dropped entries not yet in the collection
        const entryIds = resolveTransferredEntryIds(drag.data).filter(
          (entryId) => !entries.includes(entryId),
        );

        if (!entryIds.length) {
          return;
        }

        // Add the entries to the collection
        Collections.addItems(collectionId, entryIds);
      },
    );

    return () => {
      Events.removeListener(DragAndDrop.events.Ended, listenerId);
    };
  }, [view.id, collectionId, entries]);

  // Create entries from content dropped in from outside the app and
  // add them to the view's collection.
  async function handleDrop(drop: DropEventData) {
    // Leave dropped entries to the drag ended listener
    if (resolveTransferredEntryIds(drop.data).length) {
      return;
    }

    // Create the entries in the view's database, when it has one
    const created = await DatabaseEntries.createFromTransferData(
      drop.data,
      resolveDataSourceDatabaseId(view.dataSource) ?? undefined,
    );

    if (!collectionId || !created.length) {
      return;
    }

    // Add the created entries to the collection
    await Collections.addItems(
      collectionId,
      created.map((entry) => entry.id),
    );
  }

  if (!viewType) {
    return null;
  }

  return (
    <div
      {...droppableProps}
      ref={elementRefs}
      className="content-view-renderer"
    >
      <TransientViewStateScope segment={view.id}>
        <viewType.component view={view} entries={sortedEntries} />
      </TransientViewStateScope>
    </div>
  );
};
