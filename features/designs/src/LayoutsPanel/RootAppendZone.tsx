import { useCallback } from 'react';
import { DropEventData, Selection, useDroppable } from '@minddrop/selection';
import { useDesignStudio, useElement } from '../DesignStudioStore';
import { handleDropOnGap } from '../handleDropOnGap';
import { FlatRootDesignElement } from '../types';
import { hasPagePanels } from '../utils';

/**
 * Hosts the append drop strip over the panel content below the
 * element tree: a slim band at the bottom of the tree appending
 * dropped elements to the end of the active layout's root.
 */
export const RootAppendZone: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const studio = useDesignStudio();
  const root = useElement<FlatRootDesignElement>('root');
  // The strip only takes pointer events while a drag is under way,
  // so it never blocks the content it overlaps
  const isDragging = Selection.useIsDragging();

  // Dropping on the strip adds to the end of the root's children
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      if (!root) {
        return;
      }

      handleDropOnGap(studio, drop, 'root', root.children.length);
    },
    [studio, root],
  );

  const { droppableProps, isDraggingOver } = useDroppable({
    type: 'design-element',
    id: 'root',
    axis: 'container',
    onDrop: handleDrop,
  });

  // A panelled root arranges its panel regions rather than
  // free-form children: content can only be dropped inside them,
  // so the strip would only advertise a drop the studio refuses
  const isPanelled = root ? hasPagePanels(studio, root) : false;

  return (
    <div className="designs-root-append-zone">
      {/** The drop strip overlaps the top of the content rather
       * than taking space in the flow, so appearing at drag start
       * cannot shift the layout under a just-started drag **/}
      {!isPanelled && (
        <div
          className="designs-root-append-zone-target"
          data-dragging={isDragging}
          data-dragging-over={isDraggingOver}
          {...droppableProps}
        />
      )}
      {children}
    </div>
  );
};
