import React, { useEffect, useState } from 'react';
import { Events, OpenConfirmationDialogEventData } from '@minddrop/events';
import { ConfirmationDialog } from '@minddrop/ui-primitives';

/**
 * Opens a confirmation dialog for each dispatched open confirmation
 * dialog event.
 */
export const ConfirmationDialogFeature: React.FC = () => {
  const [open, setOpen] = useState(false);
  // Null until a dialog is requested, so there is no placeholder content
  const [dialogProps, setDialogProps] =
    useState<OpenConfirmationDialogEventData | null>(null);

  useEffect(() => {
    Events.addListener(
      Events.events.OpenConfirmationDialog,
      'desktop-app',
      (data) => {
        setDialogProps(data);
        setOpen(true);
      },
    );

    return () => {
      Events.removeListener(
        Events.events.OpenConfirmationDialog,
        'desktop-app',
      );
    };
  }, []);

  if (!dialogProps) {
    return null;
  }

  return (
    <ConfirmationDialog {...dialogProps} open={open} onOpenChange={setOpen} />
  );
};
