import { Field } from '@base-ui/react/field';
import React from 'react';
import { propsToClass } from '../../utils';
import './FieldRoot.css';

export interface FieldRootProps extends Field.Root.Props {
  /*
   * Class name applied to the root element.
   */
  className?: string;
}

export const FieldRoot = React.forwardRef<HTMLDivElement, FieldRootProps>(
  ({ className, ...other }, ref) => (
    <Field.Root
      ref={ref}
      className={propsToClass('field-root', { className })}
      {...other}
    />
  ),
);

FieldRoot.displayName = 'FieldRoot';
