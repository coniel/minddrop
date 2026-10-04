import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { ContentViewTypes, ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseEntries, Databases, Entry } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import {
  DragSource,
  dragAndDrop,
  dropNative,
} from '@minddrop/drag-and-drop/test-utils';
import { ContentViewRenderer } from '@minddrop/feature-content-views';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import {
  AddContentDataKey,
  DatabaseEntriesDataKey,
} from '@minddrop/ui-databases';
import { CanvasViewType } from '../CanvasViewType';
import {
  DEFAULT_NODE_WIDTH,
  ESTIMATED_NODE_HEIGHT,
  NODE_GAP,
  defaultCanvasViewData,
} from '../constants';
import { cleanup, setup } from '../test-utils';
import { CanvasViewData } from '../types';
import { CanvasViewComponent } from './CanvasView';

const { collection_1 } = CollectionFixtures;
const { contentView_board_1 } = ContentViewFixtures;
const {
  objectDatabase,
  objectEntry1,
  rootStorageDatabase,
  validImagePropertyFile,
} = DatabaseFixtures;

// A canvas of an empty collection
const collection = { ...collection_1, items: [] };
const view = {
  ...contentView_board_1,
  type: 'canvas',
  dataSource: { type: 'collection' as const, id: collection.id },
  data: defaultCanvasViewData,
};

// An entry modified after everything the fixtures carry, so the
// picker lists it among the recent entries.
const recentEntry: Entry = {
  ...objectEntry1,
  id: 'database-entry_recent',
  title: 'Recent entry',
  lastModified: new Date('2026-03-01T00:00:00.000Z'),
};

// Where the add content card is dropped
const dropPoint = { clientX: 400, clientY: 200 };

describe('<CanvasViewComponent />', () => {
  beforeEach(() => {
    setup();

    Collections.Store.load([collection]);
    ContentViews.Store.load([view]);
    DatabaseEntries.Store.load([recentEntry]);
  });

  afterEach(async () => {
    ContentViewTypes.unregister(CanvasViewType.type);
    await cleanup();
  });

  /**
   * Renders the canvas and drops the add content card on it,
   * opening the picker at the drop point.
   */
  function openPicker() {
    render(
      <>
        <CanvasViewComponent view={view} entries={[]} />
        <DragSource data={{ [AddContentDataKey]: true }} />
      </>,
    );

    dragAndDrop(
      screen.getByTestId('drag-source'),
      document.querySelector('.canvas-view')!,
      dropPoint,
    );
  }

  /**
   * Returns the canvas's persisted nodes.
   */
  function canvasNodes() {
    return (ContentViews.get(view.id).data as CanvasViewData).nodes;
  }

  // The position of a node centred horizontally on the drop point
  const droppedNodePosition = {
    x: dropPoint.clientX - DEFAULT_NODE_WIDTH / 2,
    y: dropPoint.clientY,
  };

  it('places a picked entry at the drop point and adds it to the collection', async () => {
    openPicker();

    await userEvent.click(await screen.findByText(recentEntry.title));

    await waitFor(() => {
      expect(Collections.get(collection.id).items).toEqual([recentEntry.id]);
    });
    expect(canvasNodes()).toEqual([
      expect.objectContaining({ id: recentEntry.id, ...droppedNodePosition }),
    ]);
  });

  it('places an entry created from a picked database and adds it to the collection', async () => {
    openPicker();

    await userEvent.click(await screen.findByText(objectDatabase.entryName));

    await waitFor(() => {
      expect(Collections.get(collection.id).items).toHaveLength(1);
    });

    const [createdId] = Collections.get(collection.id).items;

    expect(DatabaseEntries.get(createdId).database).toBe(objectDatabase.id);
    expect(canvasNodes()).toEqual([
      expect.objectContaining({ id: createdId, ...droppedNodePosition }),
    ]);
  });

  it('places a dropped entry at the drop point and adds it to the collection', async () => {
    // Render the canvas inside the renderer. The renderer adds dropped
    // entries to the collection.
    ContentViewTypes.register(CanvasViewType);
    render(
      <>
        <ContentViewRenderer view={view} entries={[]} />
        <DragSource data={{ [DatabaseEntriesDataKey]: [recentEntry] }} />
      </>,
    );

    dragAndDrop(
      screen.getByTestId('drag-source'),
      document.querySelector('.canvas-view')!,
      dropPoint,
    );

    await waitFor(() => {
      expect(Collections.get(collection.id).items).toEqual([recentEntry.id]);
    });
    expect(canvasNodes()).toEqual([
      expect.objectContaining({ id: recentEntry.id, ...droppedNodePosition }),
    ]);
  });

  describe('content dropped from outside the app', () => {
    it('places the created entries down from the drop point and adds them to the collection', async () => {
      // Send images to a database which can hold them
      Databases.setContentDefault('image', rootStorageDatabase.id);

      render(<CanvasViewComponent view={view} entries={[]} />);

      dropNative(
        document.querySelector('.canvas-view')!,
        {},
        {
          ...dropPoint,
          files: [validImagePropertyFile, validImagePropertyFile],
        },
      );

      await waitFor(() => {
        expect(Collections.get(collection.id).items).toHaveLength(2);
      });

      const [firstId, secondId] = Collections.get(collection.id).items;

      expect(canvasNodes()).toEqual([
        expect.objectContaining({ id: firstId, ...droppedNodePosition }),
        expect.objectContaining({
          id: secondId,
          x: droppedNodePosition.x,
          y: droppedNodePosition.y + ESTIMATED_NODE_HEIGHT + NODE_GAP,
        }),
      ]);
    });
  });

  it('keeps the picker open after a shift-picked entry', async () => {
    const user = userEvent.setup();

    openPicker();

    await user.keyboard('{Shift>}');
    await user.click(await screen.findByText(recentEntry.title));
    await user.keyboard('{/Shift}');

    await waitFor(() => {
      expect(Collections.get(collection.id).items).toEqual([recentEntry.id]);
    });
    expect(canvasNodes()).toEqual([
      expect.objectContaining({ id: recentEntry.id, ...droppedNodePosition }),
    ]);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
