import { Dialog, DialogRoot } from '@minddrop/ui-primitives';
import { CreateWorkspaceForm } from '@minddrop/ui-workspaces';

export interface CreateWorkspaceDialogProps {
  /**
   * Whether the dialog is open.
   */
  open: boolean;

  /**
   * Callback fired when the dialog is dismissed.
   */
  onClose: () => void;
}

/**
 * Renders the workspace creation form in a dialog.
 *
 * Creating a workspace makes it active, which reloads the app into it,
 * so the dialog only has to handle being dismissed.
 */
export const CreateWorkspaceDialog: React.FC<CreateWorkspaceDialogProps> = ({
  open,
  onClose,
}) => {
  function handleOpenChange(dialogOpen: boolean) {
    if (!dialogOpen) {
      onClose();
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <Dialog width="sm">
        <CreateWorkspaceForm onCancel={onClose} onCreated={onClose} />
      </Dialog>
    </DialogRoot>
  );
};
