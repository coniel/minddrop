import { useTranslation } from '@minddrop/i18n';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@minddrop/ui-elements';
import { useToggle } from '@minddrop/utils';
import { selectFolderAsWorkspace } from '../../api/selectFolderAsWorkspace';
import { CreateWorkspaceForm } from '../CreateWorkspaceForm/CreateWorkspaceForm';
import './AddWorkspaceMenu.css';

export interface AddWorkspaceMenuProps {
  /**
   * The menu trigger button.
   */
  children: React.ReactNode;
}

export const AddWorkspaceMenu: React.FC<AddWorkspaceMenuProps> = ({
  children,
}) => {
  const { t } = useTranslation('workspaces.actions');
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
            label={t('open.label')}
            tooltipTitle={t('open.label')}
            tooltipDescription={t('open.description')}
            onSelect={selectFolderAsWorkspace}
          />
          <DropdownMenuItem
            icon="plus-square"
            label={t('create.label')}
            tooltipTitle={t('create.label')}
            tooltipDescription={t('create.description')}
            onSelect={toggleCreateDialog}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={createDialogOpen}>
        <DialogContent width="sm" className="create-workspace-dialog">
          <DialogTitle>{t('create.label')}</DialogTitle>
          <CreateWorkspaceForm
            onSuccess={toggleCreateDialog}
            onClickCancel={toggleCreateDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
