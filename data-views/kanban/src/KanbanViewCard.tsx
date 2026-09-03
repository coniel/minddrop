import React, { useCallback } from 'react';
import { DatabaseEntryRenderer } from '@minddrop/feature-databases';
import { DropEventData, useDroppable } from '@minddrop/selection';
import { useFlexDropGapActivation } from '@minddrop/ui-drag-and-drop';
import { KANBAN_ACCEPTED_DATA_TYPES } from './constants';

export interface KanbanViewCardProps {
  /**
   * The ID of the entry the card renders.
   */
  entryId: string;

  /**
   * The ID of the card layout to render the entry with.
   * Entries without an override use their database default layout.
   */
  layoutId?: string;

  /**
   * The index of the card within its column's drop container.
   * Injected by the parent FlexDropContainer.
   */
  index?: number;

  /**
   * Whether the card is the last card in its column.
   */
  isLastChild: boolean;

  /**
   * Callback fired when something is dropped onto the card.
   * Receives the index of the gap adjacent to the hovered
   * card half.
   */
  onDrop: (data: DropEventData, gapIndex: number) => void;
}

/**
 * Renders an entry card in a kanban column. During drags of
 * card-like data, activates the column gap nearest to the
 * hovered card half and routes drops to it.
 */
export const KanbanViewCard: React.FC<KanbanViewCardProps> = ({
  entryId,
  layoutId,
  index = 0,
  isLastChild,
  onDrop,
}) => {
  // Route drops to the gap adjacent to the hovered card half
  const handleDrop = useCallback(
    (data: DropEventData) => {
      onDrop(data, data.position === 'before' ? index : index + 1);
    },
    [index, onDrop],
  );

  // Make the card a position-aware drop target for card-like drags
  const { droppableProps, isDraggingOver, dropIndicatorPosition } =
    useDroppable({
      id: entryId,
      type: 'kanban-card',
      index,
      axis: 'vertical',
      isLastChild,
      accepts: KANBAN_ACCEPTED_DATA_TYPES,
      onDrop: handleDrop,
    });

  // Activate the column gap adjacent to the hovered card half
  useFlexDropGapActivation({ index, isDraggingOver, dropIndicatorPosition });

  return (
    <div {...droppableProps}>
      <DatabaseEntryRenderer
        entryId={entryId}
        layoutContext="card"
        layoutId={layoutId}
      />
    </div>
  );
};
