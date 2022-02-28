import React from 'react';
import * as DialogPrimitives from '@radix-ui/react-dialog';
import { mapPropsToClasses } from '@minddrop/utils';

export type DialogTitleProps = DialogPrimitives.DialogTitleProps;

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className,
  ...other
}) => (
  <DialogPrimitives.Title
    className={mapPropsToClasses({ className }, 'dialog-title')}
    {...other}
  >
    {children}
  </DialogPrimitives.Title>
);
