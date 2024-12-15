import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';

export interface DialogContentProps extends DialogPrimitive.DialogContentProps {
  /**
   * The width of the dialog.
   */
  width?: 'sm' | 'md' | 'lg';
}

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
  width = 'md',
  ...other
}) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="dialog-overlay">
      <DialogPrimitive.Content
        className={mapPropsToClasses({ className, width }, 'dialog-content')}
        {...other}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Overlay>
  </DialogPrimitive.Portal>
);
