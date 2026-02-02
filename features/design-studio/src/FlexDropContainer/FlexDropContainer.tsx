import React, { Children, ReactElement, cloneElement, useState } from 'react';
import { DropEventData, Selection } from '@minddrop/selection';
import { DropIndicator } from '../DropIndicator';

type FlexDirection = 'row' | 'column';
type FlexAlign =
  | 'start'
  | 'center'
  | 'end'
  | 'stretch'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

interface FlexDropContainerProps {
  id: string;
  children: React.ReactNode;
  direction?: FlexDirection;
  gap?: number;
  align?: FlexAlign;
  justify?: FlexAlign;
  onDropInGap?: (data: DropEventData) => void;
  className?: string;
  style?: React.CSSProperties;
}

interface GapDropZoneProps {
  containerId: string;
  direction: FlexDirection;
  size: number;
  index: number;
  isEdge?: boolean;
  onDrop?: (data: DropEventData) => void;
}

const GapDropZone: React.FC<GapDropZoneProps> = ({
  containerId,
  direction,
  size,
  index,
  isEdge = false,
  onDrop,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();

    if (
      e.currentTarget === e.target ||
      !e.currentTarget.contains(e.relatedTarget as Node)
    ) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    setIsDraggingOver(false);

    if (onDrop) {
      onDrop({
        data: Selection.getEventData(e),
        index,
        targetId: containerId,
        targetType: 'flex-drop-container',
        event: e,
        position: 'inside',
      });
    }
  };

  const style: React.CSSProperties = {
    position: 'relative',
    flexShrink: 0,
    ...(direction === 'row'
      ? {
          width: isEdge ? 'auto' : size,
          flexGrow: isEdge ? 1 : 0,
          alignSelf: 'stretch',
        }
      : {
          height: isEdge ? 'auto' : size,
          flexGrow: isEdge ? 1 : 0,
          alignSelf: 'stretch',
        }),
    // Debugging: uncomment to visualize gap zones
    // backgroundColor: isEdge ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
  };

  // Calculate indicator position
  const indicatorStyle: React.CSSProperties = {
    position: 'absolute',
    ...(direction === 'row'
      ? {
          left: isEdge ? size / 2 : '50%',
          top: 0,
          bottom: 0,
          transform: isEdge ? 'none' : 'translateX(-50%)',
        }
      : {
          top: isEdge ? size / 2 : '50%',
          left: 0,
          right: 0,
          transform: isEdge ? 'none' : 'translateY(-50%)',
        }),
  };

  return (
    <div
      style={style}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-gap-zone
      data-position={index}
    >
      {isDraggingOver && (
        <div style={indicatorStyle}>
          <DropIndicator
            axis={direction === 'row' ? 'vertical' : 'horizontal'}
          />
        </div>
      )}
    </div>
  );
};

export const FlexDropContainer: React.FC<FlexDropContainerProps> = ({
  children,
  id,
  direction = 'column',
  gap = 8,
  align = 'stretch',
  justify = 'start',
  onDropInGap,
  className = '',
  style = {},
}) => {
  const childArray = Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  ) as ReactElement[];

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
  if ((needsStartEdge && childArray.length > 0) || childArray.length === 0) {
    elements.push(
      <GapDropZone
        containerId={id}
        key="gap-start"
        direction={direction}
        size={gap}
        index={0}
        isEdge={true}
        onDrop={onDropInGap}
      />,
    );
  }

  // Interleave children with gap zones
  childArray.forEach((child, index) => {
    elements.push(cloneElement(child, { key: `child-${index}`, index }));

    // Add gap zone after each child except the last
    if (index < childArray.length - 1) {
      elements.push(
        <GapDropZone
          containerId={id}
          key={`gap-${index}`}
          direction={direction}
          size={gap}
          index={index + 1}
          onDrop={onDropInGap}
        />,
      );
    }
  });

  // Add end edge gap zone if needed
  if (needsEndEdge && childArray.length > 0) {
    elements.push(
      <GapDropZone
        containerId={id}
        key="gap-end"
        direction={direction}
        size={gap}
        index={childArray.length}
        isEdge={true}
        onDrop={onDropInGap}
      />,
    );
  }

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
  };

  return (
    <div className={className} style={containerStyle}>
      {elements}
    </div>
  );
};

export default FlexDropContainer;
