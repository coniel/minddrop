import React, { useMemo } from 'react';
import { DatabaseId, Databases } from '@minddrop/databases';
import { useNewEntryDraggable } from '@minddrop/feature-databases';
import { ContentIcon, Toolbar, Tooltip } from '@minddrop/ui-primitives';
import './BoardViewToolbar.css';

const DATABASE_FALLBACK_ICON = 'content-icon:shapes:inherit';

export interface BoardViewToolbarProps {
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
  entryIds,
}) => {
  // Derive the databases the board's entries belong to
  const databaseIds = useMemo(
    () => Databases.getFromEntries(entryIds).map((database) => database.id),
    [entryIds],
  );

  return (
    <div className="board-view-toolbar">
      <Toolbar className="board-view-toolbar-content">
        {databaseIds.map((databaseId) => (
          <BoardViewToolbarDatabaseCard
            key={databaseId}
            databaseId={databaseId}
          />
        ))}
      </Toolbar>
    </div>
  );
};

interface BoardViewToolbarDatabaseCardProps {
  /**
   * The ID of the database the card creates entries in.
   */
  databaseId: DatabaseId;
}

/**
 * Renders a card representing a database, labelled with the
 * database's icon. Dragging the card onto the board creates a
 * new entry in the database.
 */
const BoardViewToolbarDatabaseCard: React.FC<
  BoardViewToolbarDatabaseCardProps
> = ({ databaseId }) => {
  const database = Databases.use(databaseId);
  const { isDragging, draggableProps } = useNewEntryDraggable(databaseId);

  // Nothing to render if the database is no longer available
  if (!database) {
    return null;
  }

  return (
    <Tooltip stringTitle={database.entryName} side="top">
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
