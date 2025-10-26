import { Separator as SeparatorPrimitive } from '@base-ui-components/react';
import { FC } from 'react';
import { mapPropsToClasses } from '../utils';
import './Separator.css';

export interface SeparatorProps extends SeparatorPrimitive.Props {
  /**
   * Margin applied to both sides of the separator.
   */
  margin?: 'small' | 'medium' | 'large';

  /**
   * Additional class names to apply to the separator.
   */
  className?: string;
}

export const Separator: FC<SeparatorProps> = ({
  children,
  className,
  margin,
  ...other
}) => (
  <SeparatorPrimitive
    className={mapPropsToClasses({ className, margin }, 'separator')}
    {...other}
  />
);
