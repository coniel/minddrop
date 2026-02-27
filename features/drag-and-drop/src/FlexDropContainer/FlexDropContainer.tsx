import React, {
  Children,
  ReactElement,
  cloneElement,
  useCallback,
} from 'react';
import { DropEventData } from '@minddrop/selection';
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
}) => {
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

  const needsStartEdge =
    justify === 'center' ||
    justify === 'end' ||
    justify === 'space-around' ||
    justify === 'space-evenly';
  const needsEndEdge =
    justify === 'center' ||
    justify === 'start' ||
    justify === 'space-around' ||
    justify === 'space-evenly';

  const elements: ReactElement[] = [];

  // Add start edge gap zone if needed
  if (needsStartEdge && childArray.length > 0) {
    elements.push(
      <FlexDropContainerGap
        containerId={id}
        key="gap-start"
        direction={direction}
        size={gap}
        index={0}
        edge="start"
        onDrop={(data) => handleDropInGap(data, 0)}
      />,
    );
  }

  // Interleave children with gap zones
  childArray.forEach((child, index) => {
    elements.push(cloneElement(child, { key: child.key, index }));

    // Add gap zone after each child except the last
    if (index < childArray.length - 1) {
      elements.push(
        <FlexDropContainerGap
          containerId={id}
          key={`gap-${index}`}
          direction={direction}
          size={gap}
          index={index + 1}
          onDrop={(data) => handleDropInGap(data, index + 1)}
        />,
      );
    }
  });

  // Add end edge gap zone if needed
  if ((needsEndEdge && childArray.length > 0) || childArray.length === 0) {
    elements.push(
      <FlexDropContainerGap
        containerId={id}
        key="gap-end"
        direction={direction}
        size={gap}
        index={childArray.length}
        edge="end"
        onDrop={(data) => handleDropInGap(data, childArray.length)}
      />,
    );
  }

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
    <div className={className} style={containerStyle}>
      {elements}
    </div>
  );
};

export default FlexDropContainer;
