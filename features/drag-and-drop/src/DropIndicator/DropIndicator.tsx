import React from 'react';
import { DropIndicatorPosition } from '@minddrop/selection';
import { propsToClass } from '@minddrop/ui-primitives';
import './DropIndicator.css';

interface DropIndicatorProps {
  axis: 'horizontal' | 'vertical';
  className?: string;
  show?: boolean;
  gap?: number;
  position?: DropIndicatorPosition;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({
  axis,
  className,
  gap = 0,
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
      style={{
        // @ts-expect-error - Gap is a CSS custom property
        '--gap': `${gap}px`,
      }}
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
