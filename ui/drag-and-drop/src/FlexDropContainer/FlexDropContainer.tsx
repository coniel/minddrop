import React, {
  Children,
  ReactElement,
  cloneElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DropEventData } from '@minddrop/selection';
import { getTransferData } from '@minddrop/utils';
import {
  FlexDropContainerContext,
  FlexDropContainerContextValue,
} from './FlexDropContainerContext';
import { FlexDropContainerGap } from './FlexDropContainerGap';

interface FlexDropContainerProps extends Record<string, unknown> {
  /**
   * The ID of the container. Used as the drop event target ID.
   */
  id: string;

  /**
   * The children of the container.
   */
  children:
    | React.ReactElement<{ index?: number }>
    | React.ReactElement<{ index?: number }>[];

  /**
   * The direction of the container's main axis.
   */
  direction?: React.CSSProperties['flexDirection'];

  /**
   * The gap between the container's children.
   */
  gap?: number;

  /**
   * The alignment of the container's children along the main axis.
   */
  align?: React.CSSProperties['alignItems'];

  /**
   * The alignment of the container's children along the cross axis.
   */
  justify?: React.CSSProperties['justifyContent'];

  /**
   * Callback fired when a gap zone or empty space is dropped on.
   */
  onDrop?: (data: DropEventData, containerId: string, gapIndex: number) => void;

  /**
   * Class name applied to the root container element.
   */
  className?: string;

  /**
   * Additional styles applied to the root container element.
   */
  style?: React.CSSProperties;
}

export const FlexDropContainer: React.FC<FlexDropContainerProps> = ({
  children,
  id,
  direction = 'column',
  gap = 8,
  align = 'stretch',
  justify = 'start',
  onDrop,
  className = '',
  style = {},
  ...rest
}) => {
  // Track which gap index is expanded (triggered by child elements)
  const [expandedGapIndex, setExpandedGapIndex] = useState<number | null>(null);

  // Ref for determining drop index from mouse position
  const containerRef = useRef<HTMLDivElement>(null);

  const childArray = Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  ) as ReactElement<{ index?: number }>[];

  const handleDropInGap = useCallback(
    (data: DropEventData, index: number) => {
      if (onDrop) {
        onDrop(data, id, index);
      }
    },
    [id, onDrop],
  );

  // Context value for child elements to request gap expansion
  const expandGap = useCallback((index: number) => {
    setExpandedGapIndex(index);
  }, []);

  const collapseGap = useCallback(() => {
    setExpandedGapIndex(null);
  }, []);

  const contextValue = useMemo<FlexDropContainerContextValue>(
    () => ({ expandGap, collapseGap }),
    [expandGap, collapseGap],
  );

  const elements: ReactElement[] = [];

  // Always add a leading gap for visual expansion during drag
  if (childArray.length > 0) {
    elements.push(
      <FlexDropContainerGap
        containerId={id}
        key="gap-start"
        direction={direction}
        size={0}
        index={0}
        isExpanded={expandedGapIndex === 0}
        onDrop={(data) => handleDropInGap(data, 0)}
      />,
    );
  }

  // Interleave children with gap zones
  childArray.forEach((child, index) => {
    elements.push(cloneElement(child, { key: child.key, index }));

    // Add gap zone after each child except the last
    if (index < childArray.length - 1) {
      const gapIndex = index + 1;

      elements.push(
        <FlexDropContainerGap
          containerId={id}
          key={`gap-${index}`}
          direction={direction}
          size={gap}
          index={gapIndex}
          isExpanded={expandedGapIndex === gapIndex}
          onDrop={(data) => handleDropInGap(data, gapIndex)}
        />,
      );
    }
  });

  // Always add a trailing gap for visual expansion during drag
  const trailingIndex = childArray.length;

  elements.push(
    <FlexDropContainerGap
      containerId={id}
      key="gap-end"
      direction={direction}
      size={0}
      index={trailingIndex}
      isExpanded={expandedGapIndex === trailingIndex}
      onDrop={(data) => handleDropInGap(data, trailingIndex)}
    />,
  );

  // Determine the drop index when something is dropped on the
  // container's empty space (not on a gap or child element).
  // Compares the mouse position along the main axis to the
  // midpoint of all children to decide start vs end.
  const getDropIndexFromPosition = useCallback(
    (event: React.DragEvent): number => {
      if (!containerRef.current || childArray.length === 0) {
        return 0;
      }

      const isRow = direction === 'row' || direction === 'row-reverse';

      // Find the bounding box of all child elements (skip gap zones)
      const childElements = containerRef.current.querySelectorAll(
        ':scope > :not([data-gap-zone])',
      );

      if (childElements.length === 0) {
        return 0;
      }

      const firstChild = childElements[0].getBoundingClientRect();
      const lastChild =
        childElements[childElements.length - 1].getBoundingClientRect();

      // Calculate the midpoint of all children along the main axis
      const childrenStart = isRow ? firstChild.left : firstChild.top;
      const childrenEnd = isRow ? lastChild.right : lastChild.bottom;
      const childrenMidpoint = (childrenStart + childrenEnd) / 2;

      // Compare mouse position to the children midpoint
      const mousePosition = isRow ? event.clientX : event.clientY;

      return mousePosition < childrenMidpoint ? 0 : childArray.length;
    },
    [direction, childArray.length],
  );

  // Handle drag over on the container itself.
  // Expands the nearest edge gap to show where the drop would land.
  const handleContainerDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';

      // Only react to drags directly over the container's empty space
      if (event.target !== containerRef.current) {
        return;
      }

      const index = getDropIndexFromPosition(event);

      setExpandedGapIndex(index);
    },
    [getDropIndexFromPosition],
  );

  // Collapse the expanded gap when the drag leaves the container
  const handleContainerDragLeave = useCallback((event: React.DragEvent) => {
    if (event.target === containerRef.current) {
      setExpandedGapIndex(null);
    }
  }, []);

  // Handle drop on the container's empty space
  const handleContainerDrop = useCallback(
    (event: React.DragEvent) => {
      setExpandedGapIndex(null);

      // Only handle drops directly on the container, not
      // drops that bubbled up from gap zones
      if (event.defaultPrevented) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (onDrop) {
        const dropIndex = getDropIndexFromPosition(event);

        onDrop(
          {
            data: getTransferData(event),
            index: dropIndex,
            targetId: id,
            targetType: 'flex-drop-container',
            event,
            position: 'inside',
          },
          id,
          dropIndex,
        );
      }
    },
    [id, onDrop, getDropIndexFromPosition],
  );

  // Calculate the container style
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    alignItems:
      align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align,
    justifyContent:
      justify === 'start'
        ? 'flex-start'
        : justify === 'end'
          ? 'flex-end'
          : justify,
    ...style,
    // Gap is handled by the gap zones
    gap: 0,
  };

  return (
    <FlexDropContainerContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={containerRef}
        className={className}
        style={containerStyle}
        onDragOver={handleContainerDragOver}
        onDragLeave={handleContainerDragLeave}
        onDrop={handleContainerDrop}
      >
        {elements}
      </div>
    </FlexDropContainerContext.Provider>
  );
};

export default FlexDropContainer;
