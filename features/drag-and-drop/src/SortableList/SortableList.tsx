import React from 'react';
import { propsToClass } from '@minddrop/ui-primitives';
import { SortableItemRenderProps, useSortableDrag } from './useSortableDrag';
import './SortableList.css';

export type { SortableItemRenderProps };

export interface SortableListProps {
  /**
   * Ordered item IDs.
   */
  items: string[];

  /**
   * Layout direction of the list.
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * Gap between items using the space token scale (1-7).
   */
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7;

  /**
   * Called on drop with the reordered item IDs.
   */
  onSort: (newOrder: string[]) => void;

  /**
   * Render function for each item. Receives the item ID and render props.
   */
  renderItem: (id: string, props: SortableItemRenderProps) => React.ReactNode;

  /**
   * The rendered container element.
   * @default 'div'
   */
  as?: React.ElementType;

  /**
   * Additional class name for the container.
   */
  className?: string;
}

/**
 * Drag-and-drop sortable list component. Constrains movement to a
 * single axis, keeps items within the container, and animates
 * displaced items smoothly.
 */
export const SortableList: React.FC<SortableListProps> = ({
  items,
  direction = 'vertical',
  gap = 2,
  onSort,
  renderItem,
  as,
  className,
}) => {
  // Get per-item drag render props from the hook
  const renderPropsMap = useSortableDrag({ items, direction, gap, onSort });

  const Component = as ?? 'div';

  return (
    <Component
      className={propsToClass('sortable-list', {
        direction,
        gap,
        className,
      })}
    >
      {items.map((id) => {
        const itemProps = renderPropsMap.get(id);

        if (!itemProps) {
          return null;
        }

        return (
          <React.Fragment key={id}>{renderItem(id, itemProps)}</React.Fragment>
        );
      })}
    </Component>
  );
};

SortableList.displayName = 'SortableList';
