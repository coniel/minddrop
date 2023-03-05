import { FC } from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { mapPropsToClasses } from '@minddrop/utils';
import './Separator.css';

export interface SeparatorProps extends SeparatorPrimitive.SeparatorProps {
  /**
   * Margin applied to both sides of the separator.
   */
  margin?: 'small' | 'medium' | 'large';
}

export const Separator: FC<SeparatorProps> = ({
  children,
  className,
  margin,
  ...other
}) => (
  <SeparatorPrimitive.Root
    className={mapPropsToClasses({ className, margin }, 'separator')}
    {...other}
  />
);
