import { Separator as SeparatorPrimitive } from '@base-ui/react';
import { FC } from 'react';
import { propsToClass } from '../utils';
import './Separator.css';

export interface SeparatorProps extends SeparatorPrimitive.Props {
  /*
   * Margin applied to both sides of the separator.
   * Uses space tokens: small=8px, medium=12px, large=24px.
   */
  margin?: 'small' | 'medium' | 'large';

  /*
   * Class name applied to the separator element.
   */
  className?: string;
}

export const Separator: FC<SeparatorProps> = ({
  className,
  margin,
  ...other
}) => (
  <SeparatorPrimitive
    className={propsToClass('separator', { margin, className })}
    {...other}
  />
);
