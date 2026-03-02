import React, {
  Children,
  ReactElement,
  cloneElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { DropEventData } from '@minddrop/selection';
import {
  FlexDropContainerContext,
  FlexDropContainerContextValue,
} from './FlexDropContainerContext';
import { FlexDropContainerGap } from './FlexDropContainerGap';

interface FlexDropContainerProps {
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
   * Callback fired when a gap zone is dropped.
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

  /**
   * Whether the trailing gap should grow to fill all remaining
   * space in the container.
   */
  fillEnd?: boolean;
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
  fillEnd = false,
}) => {
  // Track which gap index is expanded (triggered by child elements)
  const [expandedGapIndex, setExpandedGapIndex] = useState<number | null>(null);

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

  // Determine which edge gaps need to fill based on alignment.
  // The leading gap fills when content is pushed away from the start
  // (end, center, space-around, space-evenly).
  // The trailing gap fills when content is pushed away from the end
  // (start, center, space-around, space-evenly).
  // fillEnd additionally enables the trailing fill, but only when
  // it wouldn't conflict with end alignment.
  const fillStart =
    justify === 'center' ||
    justify === 'end' ||
    justify === 'space-around' ||
    justify === 'space-evenly';
  const fillTrailing =
    justify === 'center' ||
    justify === 'start' ||
    justify === 'space-around' ||
    justify === 'space-evenly' ||
    (fillEnd && justify !== 'end');

  const elements: ReactElement[] = [];

  // Always add a leading gap (fills remaining space based on alignment)
  if (childArray.length > 0) {
    elements.push(
      <FlexDropContainerGap
        containerId={id}
        key="gap-start"
        direction={direction}
        size={0}
        index={0}
        fill={fillStart}
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

  // Always add a trailing gap (fills remaining space based on alignment or fillEnd)
  const trailingIndex = childArray.length;

  elements.push(
    <FlexDropContainerGap
      containerId={id}
      key="gap-end"
      direction={direction}
      size={0}
      index={trailingIndex}
      fill={fillTrailing}
      isExpanded={expandedGapIndex === trailingIndex}
      onDrop={(data) => handleDropInGap(data, trailingIndex)}
    />,
  );

  // Calculate the container style
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    alignItems:
      align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align,
    // Alignment along the main axis is handled by fill gaps,
    // so always use flex-start here.
    justifyContent: 'flex-start',
    ...style,
    // Gap is handled by the gap zones
    gap: 0,
  };

  return (
    <FlexDropContainerContext.Provider value={contextValue}>
      <div className={className} style={containerStyle}>
        {elements}
      </div>
    </FlexDropContainerContext.Provider>
  );
};

export default FlexDropContainer;
