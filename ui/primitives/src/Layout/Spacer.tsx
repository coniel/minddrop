import React from 'react';

export const Spacer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ style, ...other }, ref) => (
    <div ref={ref} style={{ flex: 1, ...style }} {...other} />
  ),
);

Spacer.displayName = 'Spacer';
