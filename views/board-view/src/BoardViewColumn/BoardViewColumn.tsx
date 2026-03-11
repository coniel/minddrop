import React, { useCallback } from 'react';
import { DatabaseEntryRenderer } from '@minddrop/feature-databases';
import { DropEventData } from '@minddrop/selection';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { Button } from '@minddrop/ui-primitives';
import './BoardViewColumn.css';

export interface BoardViewColumnProps {
  /**
   * The index of this column within the board.
   */
  columnIndex: number;

  /**
   * The entry IDs to render in this column, ordered top to bottom.
   */
  entryIds: string[];

  /**
   * Whether the column can be deleted. When true, a delete
   * button appears on hover.
   */
  canDelete: boolean;

  /**
   * Callback fired when an entry is dropped into this column.
   */
  onDrop: (
    data: DropEventData,
    entryId: string,
    targetColumnIndex: number,
    targetEntryIndex: number,
  ) => void;

  /**
   * Callback fired when the user deletes this column.
   * Only available when the column is empty.
   */
  onDelete: (columnIndex: number) => void;
}

/**
 * Renders a single column in the board view containing
 * draggable entry cards.
 */
export const BoardViewColumn: React.FC<BoardViewColumnProps> = ({
  columnIndex,
  entryIds,
  canDelete,
  onDrop,
  onDelete,
}) => {
  // Handle an entry being dropped into this column at a
  // specific gap index
  const handleDrop = useCallback(
    (data: DropEventData, _containerId: string, gapIndex: number) => {
      const entryId = data.data as string;

      if (!entryId) {
        return;
      }

      onDrop(data, entryId, columnIndex, gapIndex);
    },
    [columnIndex, onDrop],
  );

  // Handle clicking the delete button
  const handleDelete = useCallback(() => {
    onDelete(columnIndex);
  }, [columnIndex, onDelete]);

  return (
    <div
      className={`board-view-column${entryIds.length === 0 ? ' board-view-column-empty' : ''}`}
    >
      <FlexDropContainer
        id={`board-column-${columnIndex}`}
        direction="column"
        gap={16}
        className="board-view-column-content"
        onDrop={handleDrop}
      >
        {entryIds.map((entryId) => (
          <DatabaseEntryRenderer
            key={entryId}
            entryId={entryId}
            designType="card"
          />
        ))}
      </FlexDropContainer>

      {canDelete && (
        <div className="board-view-column-delete">
          <Button
            label="views.board.removeColumn"
            variant="ghost"
            size="sm"
            danger="on-hover"
            onClick={handleDelete}
          />
        </div>
      )}
    </div>
  );
};
