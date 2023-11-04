import { useTranslation } from '@minddrop/i18n';
import { useToggle } from '@minddrop/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@minddrop/ui';
import { CreateWorkspaceForm } from '../CreateWorkspaceForm/CreateWorkspaceForm';
import './AddWorkspaceMenu.css';
import { selectFolderAsWorkspace } from '../selectFolderAsWorkspace';

export interface AddWorkspaceMenuProps {
  /**
   * The menu trigger button.
   */
  children: React.ReactNode;
}

export const AddWorkspaceMenu: React.FC<AddWorkspaceMenuProps> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [createDialogOpen, toggleCreateDialog] = useToggle(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>{children}</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" style={{ width: 220 }}>
          <DropdownMenuItem
            icon="folder"
            label={t('openWorkspace')}
            tooltipTitle={t('openWorkspace')}
            tooltipDescription={t('openWorkspaceDescription')}
            onSelect={selectFolderAsWorkspace}
          />
          <DropdownMenuItem
            icon="plus-square"
            label={t('createWorkspace')}
            tooltipTitle={t('createWorkspace')}
            tooltipDescription={t('createWorkspaceDescription')}
            onSelect={toggleCreateDialog}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={createDialogOpen}>
        <DialogContent width="sm" className="create-workspace-dialog">
          <DialogTitle>{t('createWorkspace')}</DialogTitle>
          <CreateWorkspaceForm
            onSuccess={toggleCreateDialog}
            onClickCancel={toggleCreateDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
