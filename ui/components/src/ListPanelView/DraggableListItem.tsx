import React from 'react';
import { Selection, SelectionItem } from '@minddrop/selection';
import { propsToClass } from '@minddrop/ui-primitives';

export interface DraggableListItemProps {
  /**
   * The selection item the row is dragged as.
   */
  selectionItem: SelectionItem;

  /**
   * The row to make draggable.
   */
  children: React.ReactNode;
}

/**
 * Makes a listed item draggable as a selection item carrying its
 * entity, so it can be dropped wherever that entity is taken.
 */
export const DraggableListItem: React.FC<DraggableListItemProps> = ({
  selectionItem,
  children,
}) => {
  const { draggableProps, isDragging } = Selection.useDraggable(selectionItem);

  return (
    <div
      className={propsToClass('list-panel-view-item-drag', {
        dragging: isDragging,
      })}
      {...draggableProps}
    >
      {children}
    </div>
  );
};
