import { useCallback } from 'react';
import { getCurrent } from '@tauri-apps/api/window';
import { ActionCard, Button } from '@minddrop/ui';
import { useTranslation } from '@minddrop/i18n';
import { selectFolderAsWorkspace } from '../../../api/selectFolderAsWorkspace';

export const OpenWorkspaceCard: React.FC = () => {
  const { t } = useTranslation('workspaces.actions.open');

  const openDirSelection = useCallback(async () => {
    // Add workspace from folder selection
    const workspace = await selectFolderAsWorkspace();

    // Close this window if a workspace was added
    if (workspace) {
      getCurrent().close();
    }
  }, []);

  return (
    <ActionCard
      icon="folder"
      title={t('label')}
      description={t('description')}
      action={
        <Button
          label={t('action')}
          variant="contained"
          onClick={openDirSelection}
        />
      }
    />
  );
};
