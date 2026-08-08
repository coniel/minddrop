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
   * The card layout to render each entry with, keyed by entry ID.
   * Entries without an override use their database default layout.
   */
  entryCardLayouts: Record<string, string>;

  /**
   * Whether the column can be deleted. When true, a delete
   * button appears on hover.
   */
  canDelete: boolean;

  /**
   * An entry picker rendered among the column's cards at
   * `pickerIndex`.
   */
  picker?: React.ReactNode;

  /**
   * The position within the column at which to render the picker.
   */
  pickerIndex?: number;

  /**
   * Callback fired when something is dropped into this column.
   */
  onDrop: (
    data: DropEventData,
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
  entryCardLayouts,
  canDelete,
  picker,
  pickerIndex,
  onDrop,
  onDelete,
}) => {
  // Handle a drop into this column at a specific gap index
  const handleDrop = useCallback(
    (data: DropEventData, _containerId: string, gapIndex: number) => {
      onDrop(data, columnIndex, gapIndex);
    },
    [columnIndex, onDrop],
  );

  // Handle clicking the delete button
  const handleDelete = useCallback(() => {
    onDelete(columnIndex);
  }, [columnIndex, onDelete]);

  // Entry cards with the picker spliced in at its position
  const cards = entryIds.map((entryId) => (
    <DatabaseEntryRenderer
      key={entryId}
      entryId={entryId}
      layoutContext="card"
      layoutId={entryCardLayouts[entryId]}
    />
  ));

  if (picker && pickerIndex !== undefined) {
    cards.splice(
      pickerIndex,
      0,
      <React.Fragment key="picker">{picker}</React.Fragment>,
    );
  }

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
        {cards}
      </FlexDropContainer>

      {canDelete && (
        <div className="board-view-column-delete">
          <Button
            label="dataViews.board.removeColumn"
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
