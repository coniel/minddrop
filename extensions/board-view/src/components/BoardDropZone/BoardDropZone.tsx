import React, { useState } from 'react';
import { useApi } from '@minddrop/extension';

export interface BoardDropZoneProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The drop event handler.
   */
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;

  /**
   * When `false`, the drag over indicator is not rendered.
   */
  dragIndicator?: boolean;

  /**
   * Optional children to render.
   */
  children?: React.ReactNode;
}

export const BoardDropZone: React.FC<BoardDropZoneProps> = ({
  onDrop,
  className,
  dragIndicator = true,
  children,
  ...other
}) => {
  const {
    Utils: { mapPropsToClasses },
    Selection,
  } = useApi();
  const [dragOver, setDragOver] = useState(false);

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setDragOver(false);

    onDrop(event);
  };

  return (
    <div
      className={mapPropsToClasses(
        {
          active: dragOver,
        },
        className,
      )}
      onClick={Selection.clear}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      {...other}
    >
      {dragIndicator && (
        <div
          style={{ userSelect: 'none', pointerEvents: 'none' }}
          className="drag-over-indicator"
        />
      )}
      {children}
    </div>
  );
};
