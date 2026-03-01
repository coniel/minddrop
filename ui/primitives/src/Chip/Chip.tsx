import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { ContentColor } from '@minddrop/theme';
import { propsToClass } from '../utils';
import './Chip.css';

export type ChipVariant = 'rectangular' | 'round';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /**
   * Chip content. Use `label` for i18n keys.
   */
  children?: React.ReactNode;

  /**
   * i18n key for the chip label.
   */
  label?: string;

  /**
   * Shape variant.
   * @default 'rectangular'
   */
  variant?: ChipVariant;

  /**
   * Size.
   * @default 'md'
   */
  size?: ChipSize;

  /**
   * Content color variant.
   * @default 'default'
   */
  color?: ContentColor;
}

/**
 * Small inline element for displaying labels, tags, or status indicators.
 */
export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      variant = 'rectangular',
      size = 'md',
      color = 'default',
      label,
      children,
      className,
      ...other
    },
    ref,
  ) => {
    const { t } = useTranslation();

    // Build the class string from props
    const classes = propsToClass('chip', {
      variant: variant !== 'rectangular' ? variant : undefined,
      size,
      color: color !== 'default' ? color : undefined,
      className,
    });

    return (
      <span ref={ref} className={classes} {...other}>
        {label ? t(label) : children}
      </span>
    );
  },
);

Chip.displayName = 'Chip';
