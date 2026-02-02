import React from 'react';

interface DropIndicatorProps {
  axis: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({
  axis,
  style,
}) => {
  const isHorizontal = axis === 'horizontal';

  const lineStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: '#3b82f6', // Blue color
    ...(isHorizontal
      ? {
          width: '100%',
          height: '2px',
          top: '50%',
          left: 2,
          transform: 'translateY(-50%)',
        }
      : {
          height: '100%',
          width: '2px',
          left: '50%',
          top: 2,
          transform: 'translateX(-50%)',
        }),
  };

  const circleStyle: React.CSSProperties = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: '2px solid #3b82f6',
    ...(isHorizontal
      ? {
          left: '-1px',
          top: 0,
          transform: 'translateY(-50%)',
        }
      : {
          top: -4,
          left: '50%',
          transform: 'translateX(-50%)',
        }),
  };

  return (
    <div
      style={{
        position: 'absolute',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div style={lineStyle} />
      <div style={circleStyle} />
    </div>
  );
};

export default DropIndicator;
