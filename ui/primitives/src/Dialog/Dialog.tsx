import { Dialog as DialogPrimitives } from '@base-ui/react/dialog';
import React from 'react';
import { propsToClass } from '../utils';
import './Dialog.css';

export type DialogWidth = 'sm' | 'md' | 'lg';

export interface DialogProps extends DialogPrimitives.Popup.Props {
  /*
   * Class name applied to the dialog popup.
   */
  className?: string;

  /**
   * Maximum width of the dialog.
   * @default 'md'
   */
  width?: DialogWidth;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  className,
  width = 'md',
  ...other
}) => {
  return (
    <DialogPrimitives.Portal>
      <DialogPrimitives.Backdrop className="dialog-backdrop" />
      <DialogPrimitives.Popup
        className={propsToClass('dialog-popup', { width, className })}
        {...other}
      >
        {children}
      </DialogPrimitives.Popup>
    </DialogPrimitives.Portal>
  );
};

export const DialogTitle: React.FC<DialogPrimitives.Title.Props> = ({
  children,
  className,
  ...other
}) => (
  <DialogPrimitives.Title
    className={`dialog-title ${className}`.trim()}
    {...other}
  >
    {children}
  </DialogPrimitives.Title>
);

export const DialogDescription: React.FC<
  DialogPrimitives.Description.Props
> = ({ children, className, ...other }) => (
  <DialogPrimitives.Description
    className={`dialog-description ${className}`.trim()}
    {...other}
  >
    {children}
  </DialogPrimitives.Description>
);

/* Re-exported primitives for composing dialog content. */
export const DialogRoot = DialogPrimitives.Root;
export const DialogTrigger = DialogPrimitives.Trigger;
export const DialogPortal = DialogPrimitives.Portal;
export const DialogBackdrop = DialogPrimitives.Backdrop;
export const DialogPopup = DialogPrimitives.Popup;
export const DialogClose = DialogPrimitives.Close;
