import React from 'react';
import * as DialogPrimitives from '@radix-ui/react-dialog';
import { mapPropsToClasses } from '@minddrop/utils';

export type DialogDescriptionProps = DialogPrimitives.DialogDescriptionProps;

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  className,
  ...other
}) => (
  <DialogPrimitives.Description
    className={mapPropsToClasses({ className }, 'dialog-description')}
    {...other}
  >
    {children}
  </DialogPrimitives.Description>
);
