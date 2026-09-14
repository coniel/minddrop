import React from 'react';
import { DropIndicatorPosition } from '@minddrop/selection';
import { propsToClass } from '@minddrop/ui-primitives';
import './DropIndicator.css';

interface DropIndicatorProps {
  axis: 'horizontal' | 'vertical';
  className?: string;
  show?: boolean;

  /**
   * The space between the list's items, in pixels, which the
   * indicator centres itself in. Taken from the list's own
   * `--drop-indicator-gap` when omitted.
   */
  gap?: number;
  position?: DropIndicatorPosition;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({
  axis,
  className,
  gap,
  show = false,
  position: positionProp,
}) => {
  const isHorizontal = axis === 'horizontal';
  const position = positionProp ?? 'inside';

  if (!show) {
    return null;
  }

  return (
    <div
      className={propsToClass('drop-indicator', {
        horizontal: isHorizontal,
        vertical: !isHorizontal,
        position,
        className,
      })}
      style={
        gap === undefined
          ? undefined
          : ({
              '--drop-indicator-gap': `${gap}px`,
            } as React.CSSProperties)
      }
    >
      <div
        className={propsToClass('drop-indicator-circle', {
          horizontal: isHorizontal,
          vertical: !isHorizontal,
        })}
      />
      <div
        className={propsToClass('drop-indicator-line', {
          horizontal: isHorizontal,
          vertical: !isHorizontal,
        })}
      />
    </div>
  );
};

export default DropIndicator;
