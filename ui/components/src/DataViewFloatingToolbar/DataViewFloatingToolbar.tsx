import React, { useEffect, useRef, useState } from 'react';
import { DatabaseId, Databases } from '@minddrop/databases';
import {
  ContentIcon,
  Icon,
  Toolbar,
  ToolbarSeparator,
  Tooltip,
} from '@minddrop/ui-primitives';
import { DATABASE_FALLBACK_ICON } from '../constants';
import { useAddExistingEntryDraggable } from '../useAddExistingEntryDraggable';
import { useNewEntryDraggable } from '../useNewEntryDraggable';
import { useNewEntryPickerDraggable } from '../useNewEntryPickerDraggable';
import './DataViewFloatingToolbar.css';

export interface DataViewFloatingToolbarCard {
  /**
   * The ID of the database the card creates entries in.
   */
  databaseId: DatabaseId;

  /**
   * The ID of the entry template the card creates entries from.
   */
  templateId?: string;
}

export interface DataViewFloatingToolbarProps {
  /**
   * The database cards to render, in order, ahead of the new
   * entry and add existing entry cards.
   */
  databaseCards: DataViewFloatingToolbarCard[];

  /**
   * Whether a menu rendered in the trailing slot is open. While
   * open, the toolbar pins its right edge in place so that card
   * visibility changes resize it leftward rather than
   * re-centering it (which would move the open menu).
   */
  menuOpen?: boolean;

  /**
   * Content rendered after the default cards, preceded by a
   * separator.
   */
  children?: React.ReactNode;
}

/**
 * Renders a data view's floating toolbar, containing a card for
 * each of the given databases, a new entry picker card, and an
 * add existing entry card, all of which create entries in the
 * view when dragged into it.
 *
 * Sticks to the bottom center of the nearest scrollport and is
 * revealed while the view is hovered. The view must carry the
 * `data-view-floating-toolbar-host` class for the hover reveal.
 */
export const DataViewFloatingToolbar: React.FC<
  DataViewFloatingToolbarProps
> = ({ databaseCards, menuOpen = false, children }) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  // The menu open state the pinning effect last reacted to, used
  // to ignore renders in which it did not change
  const previousMenuOpenRef = useRef(menuOpen);

  // The toolbar's right edge offset from the anchor while a menu
  // is open, pinning it in place
  const [pinnedRightOffset, setPinnedRightOffset] = useState<number | null>(
    null,
  );

  // Pin the toolbar's right edge while a menu is open, keeping
  // the menu trigger (and thus the open menu) in place. On close,
  // move the pin to the centered position so the CSS transition
  // animates the toolbar back to center.
  useEffect(() => {
    // Ignore renders in which the menu's open state did not change
    if (menuOpen === previousMenuOpenRef.current) {
      return;
    }

    previousMenuOpenRef.current = menuOpen;

    // Nothing to unpin when the toolbar was never pinned
    if (!menuOpen && pinnedRightOffset === null) {
      return;
    }

    const content = anchorRef.current?.querySelector(
      '.data-view-floating-toolbar-content',
    );

    if (!(content instanceof HTMLElement)) {
      setPinnedRightOffset(null);

      return;
    }

    // The toolbar is centered on the anchor, so its right edge
    // sits half its width to the right of it
    const centeredOffset = content.offsetWidth / 2;

    // Closing without a size change: already centered, unpin
    // directly as no transition will fire
    if (!menuOpen && pinnedRightOffset === centeredOffset) {
      setPinnedRightOffset(null);

      return;
    }

    setPinnedRightOffset(centeredOffset);
  }, [menuOpen, pinnedRightOffset]);

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
    <div ref={anchorRef} className="data-view-floating-toolbar">
      <Toolbar
        className="data-view-floating-toolbar-content"
        style={
          pinnedRightOffset !== null
            ? { left: 'auto', right: -pinnedRightOffset, transform: 'none' }
            : undefined
        }
        onTransitionEnd={handleToolbarTransitionEnd}
      >
        {databaseCards.map((card) => (
          <DatabaseCard
            key={card.databaseId}
            databaseId={card.databaseId}
            templateId={card.templateId}
          />
        ))}

        {/* Separate the database cards from the default cards */}
        {databaseCards.length > 0 && <ToolbarSeparator />}

        <NewEntryCard />

        <AddExistingEntryCard />

        {/* Trailing slot, e.g. the view's options menu */}
        {children && (
          <>
            <ToolbarSeparator />

            {children}
          </>
        )}
      </Toolbar>
    </div>
  );
};

interface DatabaseCardProps {
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
 * database's icon. Dragging the card into the view creates a new
 * entry in the database.
 */
const DatabaseCard: React.FC<DatabaseCardProps> = ({
  databaseId,
  templateId,
}) => {
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
        className="data-view-floating-toolbar-card"
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
 * new entry at the drop location when dragged into the view.
 */
const NewEntryCard: React.FC = () => {
  const { isDragging, draggableProps } = useNewEntryPickerDraggable();

  return (
    <Tooltip title="databases.entries.toolbar.newEntry" side="top">
      <div
        className="data-view-floating-toolbar-card"
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
 * drop location when dragged into the view.
 */
const AddExistingEntryCard: React.FC = () => {
  const { isDragging, draggableProps } = useAddExistingEntryDraggable();

  return (
    <Tooltip title="databases.entries.toolbar.addExistingEntry" side="top">
      <div
        className="data-view-floating-toolbar-card"
        data-dragging={isDragging || undefined}
        {...draggableProps}
      >
        <Icon name="search" color="regular" />
      </div>
    </Tooltip>
  );
};
