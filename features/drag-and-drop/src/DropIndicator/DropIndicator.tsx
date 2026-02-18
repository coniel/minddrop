import React from 'react';
import { DropIndicatorPosition } from '@minddrop/selection';
import { mapPropsToClasses } from '@minddrop/ui-primitives';
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
      className={mapPropsToClasses(
        {
          horizontal: isHorizontal,
          vertical: !isHorizontal,
          position,
          className,
        },
        'drop-indicator',
      )}
      style={{
        // @ts-expect-error - Gap is a CSS custom property
        '--gap': `${gap}px`,
      }}
    >
      <div
        className={mapPropsToClasses(
          {
            horizontal: isHorizontal,
            vertical: !isHorizontal,
          },
          'circle',
        )}
      />
      <div
        className={mapPropsToClasses(
          {
            horizontal: isHorizontal,
            vertical: !isHorizontal,
          },
          'line',
        )}
      />
    </div>
  );
};

export default DropIndicator;
