import React, { useMemo, useRef, useState } from 'react';
import { DataView } from '@minddrop/data-views';
import { DatabaseId, Databases } from '@minddrop/databases';
import { DataViewOptionsMenu } from '@minddrop/feature-data-views';
import {
  useAddExistingEntryDraggable,
  useNewEntryDraggable,
  useNewEntryPickerDraggable,
} from '@minddrop/feature-databases';
import {
  ContentIcon,
  Icon,
  Toolbar,
  ToolbarSeparator,
  Tooltip,
} from '@minddrop/ui-primitives';
import { DATABASE_FALLBACK_ICON } from '../constants';
import { BoardViewData, BoardViewOptions } from '../types';
import './BoardViewToolbar.css';

export interface BoardViewToolbarProps {
  /**
   * The data view rendering the board.
   */
  view: DataView<BoardViewOptions, BoardViewData>;

  /**
   * The IDs of the entries currently in the board.
   */
  entryIds: string[];
}

/**
 * Renders the board view's floating toolbar, containing a card
 * for each database the board's entries belong to.
 */
export const BoardViewToolbar: React.FC<BoardViewToolbarProps> = ({
  view,
  entryIds,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  // The toolbar's right edge offset from the anchor while the
  // options menu is open, pinning it in place so card visibility
  // toggles resize it leftward instead of re-centering it
  const [pinnedRightOffset, setPinnedRightOffset] = useState<number | null>(
    null,
  );

  // The user's per-database card configuration
  const toolbarCards = view.options?.toolbarCards;

  // Derive the databases the board's entries belong to,
  // excluding those whose card the user has hidden
  const databaseIds = useMemo(
    () =>
      Databases.getFromEntries(entryIds)
        .map((database) => database.id)
        .filter((databaseId) => !toolbarCards?.[databaseId]?.hidden),
    [entryIds, toolbarCards],
  );

  // Pin the toolbar's right edge while the options menu is open,
  // keeping the menu trigger (and thus the open menu) in place.
  // On close, move the pin to the centered position so the CSS
  // transition animates the toolbar back to center.
  function handleOptionsMenuOpenChange(open: boolean) {
    const content = anchorRef.current?.querySelector(
      '.board-view-toolbar-content',
    );

    // Nothing to unpin when the toolbar was never pinned
    if (!open && pinnedRightOffset === null) {
      return;
    }

    if (!(content instanceof HTMLElement)) {
      setPinnedRightOffset(null);

      return;
    }

    // The toolbar is centered on the anchor, so its right edge
    // sits half its width to the right of it
    const centeredOffset = content.offsetWidth / 2;

    // Closing without a size change: already centered, unpin
    // directly as no transition will fire
    if (!open && pinnedRightOffset === centeredOffset) {
      setPinnedRightOffset(null);

      return;
    }

    setPinnedRightOffset(centeredOffset);
  }

  // Unpin once the toolbar has animated back to the centered
  // position, at which point clearing the pin causes no movement
  function handleToolbarTransitionEnd(event: React.TransitionEvent) {
    if (
      event.target === event.currentTarget &&
      event.propertyName === 'right'
    ) {
      setPinnedRightOffset(null);
    }
  }

  return (
    <div ref={anchorRef} className="board-view-toolbar">
      <Toolbar
        className="board-view-toolbar-content"
        style={
          pinnedRightOffset !== null
            ? { left: 'auto', right: -pinnedRightOffset, transform: 'none' }
            : undefined
        }
        onTransitionEnd={handleToolbarTransitionEnd}
      >
        {databaseIds.map((databaseId) => (
          <BoardViewToolbarDatabaseCard
            key={databaseId}
            databaseId={databaseId}
            templateId={toolbarCards?.[databaseId]?.templateId}
          />
        ))}

        {/* Separate the database cards from the default cards */}
        {databaseIds.length > 0 && <ToolbarSeparator />}

        <BoardViewToolbarNewEntryCard />

        <BoardViewToolbarAddExistingCard />

        <ToolbarSeparator />

        {/* View settings menu */}
        <DataViewOptionsMenu
          view={view}
          onOpenChange={handleOptionsMenuOpenChange}
        />
      </Toolbar>
    </div>
  );
};

interface BoardViewToolbarDatabaseCardProps {
  /**
   * The ID of the database the card creates entries in.
   */
  databaseId: DatabaseId;

  /**
   * The ID of the entry template the card is configured to
   * create entries from.
   */
  templateId?: string;
}

/**
 * Renders a card representing a database, labelled with the
 * database's icon. Dragging the card onto the board creates a
 * new entry in the database.
 */
const BoardViewToolbarDatabaseCard: React.FC<
  BoardViewToolbarDatabaseCardProps
> = ({ databaseId, templateId }) => {
  const database = Databases.use(databaseId);
  const { isDragging, draggableProps } = useNewEntryDraggable(databaseId);

  // Nothing to render if the database is no longer available
  if (!database) {
    return null;
  }

  // The configured template, ignored if it no longer exists
  const template = templateId
    ? database.entryTemplates?.find((template) => template.id === templateId)
    : undefined;

  // Qualify the tooltip with the configured template's name
  const tooltip = template
    ? `${database.entryName} · ${template.name}`
    : database.entryName;

  return (
    <Tooltip stringTitle={tooltip} side="top">
      <div
        className="board-view-toolbar-card"
        data-dragging={isDragging || undefined}
        {...draggableProps}
      >
        <ContentIcon icon={database.icon || DATABASE_FALLBACK_ICON} />
      </div>
    </Tooltip>
  );
};

/**
 * Renders a card which spawns a database picker for creating a
 * new entry at the drop location when dragged onto the board.
 */
const BoardViewToolbarNewEntryCard: React.FC = () => {
  const { isDragging, draggableProps } = useNewEntryPickerDraggable();

  return (
    <Tooltip title="dataViews.board.newEntry" side="top">
      <div
        className="board-view-toolbar-card"
        data-dragging={isDragging || undefined}
        {...draggableProps}
      >
        <Icon name="plus" color="regular" />
      </div>
    </Tooltip>
  );
};

/**
 * Renders a card which spawns an existing entry picker at the
 * drop location when dragged onto the board.
 */
const BoardViewToolbarAddExistingCard: React.FC = () => {
  const { isDragging, draggableProps } = useAddExistingEntryDraggable();

  return (
    <Tooltip title="dataViews.board.addExistingEntry" side="top">
      <div
        className="board-view-toolbar-card"
        data-dragging={isDragging || undefined}
        {...draggableProps}
      >
        <Icon name="search" color="regular" />
      </div>
    </Tooltip>
  );
};
