import { Dialog as DialogPrimitives } from '@base-ui/react/dialog';
import { mapPropsToClasses } from '../utils';
import './Dialog.css';

export interface DialogProps extends DialogPrimitives.Popup.Props {
  /**
   * Class name to apply to the dialog popup.
   */
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  className,
  ...other
}) => {
  return (
    <DialogPrimitives.Portal>
      <DialogPrimitives.Backdrop className="dialog-backdrop" />
      <DialogPrimitives.Popup
        className={mapPropsToClasses({ className }, 'dialog-popup')}
        {...other}
      >
        {children}
      </DialogPrimitives.Popup>
    </DialogPrimitives.Portal>
  );
};

export const DialogRoot = DialogPrimitives.Root;
export const DialogTrigger = DialogPrimitives.Trigger;
export const DialogPortal = DialogPrimitives.Portal;
export const DialogBackdrop = DialogPrimitives.Backdrop;
export const DialogPopup = DialogPrimitives.Popup;
export const DialogTitle = DialogPrimitives.Title;
export const DialogDescription = DialogPrimitives.Description;
export const DialogClose = DialogPrimitives.Close;
