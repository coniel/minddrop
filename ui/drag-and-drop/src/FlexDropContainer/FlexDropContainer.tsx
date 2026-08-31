import React, {
  Children,
  ReactElement,
  cloneElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DropEventData, dragContainsType } from '@minddrop/selection';
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
   * The data types the container's gap zones and empty space accept
   * drops of. Drags not containing any accepted type are ignored,
   * falling through to ancestor drop targets.
   *
   * When omitted, all drags are accepted.
   */
  accepts?: string[];

  /**
   * Whether active gaps animate open to make room for the
   * dragged element.
   */
  expandActiveGap?: boolean;

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
  accepts,
  expandActiveGap = false,
  className = '',
  style = {},
  ...rest
}) => {
  // Track which gap index is active (triggered by child elements)
  const [activeGapIndex, setActiveGapIndex] = useState<number | null>(null);

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

  // Context value for child elements to request gap activation
  const activateGap = useCallback((index: number) => {
    setActiveGapIndex(index);
  }, []);

  const deactivateGap = useCallback(() => {
    setActiveGapIndex(null);
  }, []);

  const contextValue = useMemo<FlexDropContainerContextValue>(
    () => ({ activateGap, deactivateGap }),
    [activateGap, deactivateGap],
  );

  // Gap zones are flex items, so justify-content would distribute
  // them along with the children, leaving space at the container's
  // edges where the children should sit flush. The gaps take that
  // space themselves instead, which leaves the children exactly
  // where the distribution puts them.
  const spacingGaps = resolveSpacingGaps(justify);

  const elements: ReactElement[] = [];

  // Always add a leading gap so drops can target the start position
  if (childArray.length > 0) {
    elements.push(
      <FlexDropContainerGap
        containerId={id}
        key="gap-start"
        direction={direction}
        size={0}
        index={0}
        isActive={activeGapIndex === 0}
        accepts={accepts}
        expandOnActive={expandActiveGap}
        grow={spacingGaps.leading}
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
          isActive={activeGapIndex === gapIndex}
          accepts={accepts}
          expandOnActive={expandActiveGap}
          grow={spacingGaps.between}
          onDrop={(data) => handleDropInGap(data, gapIndex)}
        />,
      );
    }
  });

  // Always add a trailing gap so drops can target the end position
  const trailingIndex = childArray.length;

  elements.push(
    <FlexDropContainerGap
      containerId={id}
      key="gap-end"
      direction={direction}
      size={0}
      index={trailingIndex}
      isActive={activeGapIndex === trailingIndex}
      accepts={accepts}
      expandOnActive={expandActiveGap}
      grow={spacingGaps.trailing}
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
  // Activates the nearest edge gap to show where the drop would land.
  const handleContainerDragOver = useCallback(
    (event: React.DragEvent) => {
      // Ignore drags without an accepted data type, letting them
      // fall through to ancestor drop targets
      if (accepts && !dragContainsType(event, accepts)) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';

      // Only react to drags directly over the container's empty space
      if (event.target !== containerRef.current) {
        return;
      }

      const index = getDropIndexFromPosition(event);

      setActiveGapIndex(index);
    },
    [getDropIndexFromPosition, accepts],
  );

  // Deactivate the active gap when the drag leaves the container
  const handleContainerDragLeave = useCallback((event: React.DragEvent) => {
    if (event.target === containerRef.current) {
      setActiveGapIndex(null);
    }
  }, []);

  // Handle drop on the container's empty space
  const handleContainerDrop = useCallback(
    (event: React.DragEvent) => {
      setActiveGapIndex(null);

      // Let unaccepted drops bubble to ancestor drop targets
      if (accepts && !dragContainsType(event, accepts)) {
        return;
      }

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
    [id, onDrop, getDropIndexFromPosition, accepts],
  );

  // Calculate the container style
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    alignItems: resolveFlexAlignment(align),
    justifyContent: resolveFlexAlignment(justify),
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

/**
 * The gaps which take a share of the container's free space, so
 * that its children end up where its distribution puts them.
 */
function resolveSpacingGaps(justify: React.CSSProperties['justifyContent']): {
  leading: boolean;
  between: boolean;
  trailing: boolean;
} {
  // Centred children are pushed in from both edges
  if (justify === 'center') {
    return { leading: true, between: false, trailing: true };
  }

  // Children at the end are pushed off the leading edge
  if (justify === 'end' || justify === 'flex-end') {
    return { leading: true, between: false, trailing: false };
  }

  // Spread children keep the edges and share what is left between
  // themselves
  if (justify === 'space-between') {
    return { leading: false, between: true, trailing: false };
  }

  return { leading: false, between: false, trailing: false };
}

/**
 * Maps the shorthand 'start'/'end' alignment values to their
 * flex equivalents, passing other values through unchanged.
 *
 * @param value - The alignment value to resolve.
 * @returns The resolved flex alignment value.
 */
function resolveFlexAlignment<T extends string | undefined>(
  value: T,
): T | 'flex-start' | 'flex-end' {
  // Map the start shorthand to its flex equivalent
  if (value === 'start') {
    return 'flex-start';
  }

  // Map the end shorthand to its flex equivalent
  if (value === 'end') {
    return 'flex-end';
  }

  return value;
}
