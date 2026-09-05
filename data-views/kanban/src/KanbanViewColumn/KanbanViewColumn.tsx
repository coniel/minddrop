import React, { useCallback } from 'react';
import { DropEventData } from '@minddrop/selection';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { ScrollArea } from '@minddrop/ui-primitives';
import { KanbanViewCard } from '../KanbanViewCard';
import { KANBAN_ACCEPTED_DATA_TYPES } from '../constants';
import { KanbanColumn } from '../types';
import { resolveLaneStyle } from '../utils';
import './KanbanViewColumn.css';

export interface KanbanViewColumnProps {
  /**
   * The column to render.
   */
  column: KanbanColumn;

  /**
   * Whether the column's cards scroll on their own.
   */
  scroll: boolean;

  /**
   * The card layout to render each entry with, keyed by entry ID.
   * Entries without an override use their database default layout.
   */
  entryCardLayouts: Record<string, string>;

  /**
   * Callback fired when something is dropped into this column.
   */
  onDrop: (
    data: DropEventData,
    columnValue: string,
    targetEntryIndex: number,
  ) => void;
}

/**
 * Renders a single kanban column's draggable entry cards, below
 * the heading naming the option it groups them by.
 */
export const KanbanViewColumn: React.FC<KanbanViewColumnProps> = ({
  column,
  scroll,
  entryCardLayouts,
  onDrop,
}) => {
  // Handle a drop into this column at a specific gap index
  const handleDrop = useCallback(
    (data: DropEventData, _containerId: string, gapIndex: number) => {
      onDrop(data, column.value, gapIndex);
    },
    [column.value, onDrop],
  );

  // Handle a drop onto a card, routed to the adjacent gap index
  const handleCardDrop = useCallback(
    (data: DropEventData, gapIndex: number) => {
      onDrop(data, column.value, gapIndex);
    },
    [column.value, onDrop],
  );

  // Build a card for each entry in the column
  const cards = column.entryIds.map((entryId, entryIndex) => (
    <KanbanViewCard
      key={entryId}
      entryId={entryId}
      layoutId={entryCardLayouts[entryId]}
      isLastChild={entryIndex === column.entryIds.length - 1}
      onDrop={handleCardDrop}
    />
  ));

  // The cards' drop container, which the scrollport wraps when
  // the column scrolls on its own
  const dropContainer = (
    <FlexDropContainer
      id={`kanban-column-${column.value}`}
      direction="column"
      gap={8}
      className="kanban-view-column-content"
      accepts={KANBAN_ACCEPTED_DATA_TYPES}
      onDrop={handleDrop}
    >
      {cards}
    </FlexDropContainer>
  );

  return (
    <div
      data-kanban-column={column.value}
      className="kanban-view-column"
      style={resolveLaneStyle(column.color)}
    >
      {/** Entry cards, in their own scrollport when set to **/}
      {scroll ? (
        <ScrollArea
          className="kanban-view-column-scroll"
          stateKey={`kanban-column-${column.value}`}
        >
          {dropContainer}
        </ScrollArea>
      ) : (
        dropContainer
      )}
    </div>
  );
};
