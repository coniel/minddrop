import React from 'react';
import { Icon } from '@minddrop/ui-primitives';
import './MappableIndicator.css';

export interface MappableIndicatorProps {
  /**
   * Optional class name applied to the icon wrapper.
   */
  className?: string;
}

/**
 * Renders a small colored icon indicating that an element can
 * be mapped to database properties.
 */
export const MappableIndicator: React.FC<MappableIndicatorProps> = ({
  className,
}) => {
  return (
    <span
      className={['mappable-indicator', className].filter(Boolean).join(' ')}
    >
      <Icon name="cable" className="mappable-indicator-icon" />
    </span>
  );
};
