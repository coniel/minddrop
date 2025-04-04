import { useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Group,
} from '@minddrop/ui-elements';

export interface ConfirmationDialogProps {
  /**
   * The content of the ConfirmationDialog.
   */
  children?: React.ReactNode;

  /**
   * The dialog title.
   */
  title?: React.ReactNode;

  /**
   * The dialog description.
   */
  description?: React.ReactNode;

  /**
   * The confirm button label.
   */
  confirmLabel?: string;

  /**
   * The cancel button label.
   */
  cancelLabel?: string;

  /**
   * Callback fired when the confirm button is clicked.
   */
  onConfirm?: () => void;

  /**
   * Callback fired when the cancel button is clicked.
   */
  onCancel?: () => void;

  /**
   * When true, the confirm button will be styled as a danger button.
   */
  danger?: boolean;

  /**
   * The translation prefix for the dialog title, description, and
   * button labels.
   */
  translationPrefix?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  children,
  title,
  description,
  confirmLabel,
  cancelLabel,
  danger,
  onConfirm,
  onCancel,
  translationPrefix = '',
}) => {
  const { t } = useTranslation({ keyPrefix: translationPrefix });
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogPortal>
        <DialogContent width="sm">
          <DialogTitle>
            {typeof title === 'string' ? t(title) : title}
          </DialogTitle>
          <DialogDescription>
            {typeof description === 'string' ? t(description) : description}
          </DialogDescription>
          <Group justify="flex-end" mt="xl">
            <Button
              label={
                typeof cancelLabel === 'string'
                  ? t(cancelLabel)
                  : 'actions.cancel'
              }
              variant="text"
              onClick={handleCancel}
            />
            <Button
              label={
                typeof confirmLabel === 'string'
                  ? t(confirmLabel)
                  : 'actions.confirm'
              }
              variant={danger ? 'danger' : 'contained'}
              onClick={handleConfirm}
            />
          </Group>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
