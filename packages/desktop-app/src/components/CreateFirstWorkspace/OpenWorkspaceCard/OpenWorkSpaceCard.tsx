import { getCurrentWindow } from '@tauri-apps/api/window';
import { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { ActionCard, Button } from '@minddrop/ui-elements';
import { selectFolderAsWorkspace } from '../../../api/selectFolderAsWorkspace';

export const OpenWorkspaceCard: React.FC = () => {
  const { t } = useTranslation({ keyPrefix: 'workspaces.actions.open' });

  const openDirSelection = useCallback(async () => {
    // Add workspace from folder selection
    const workspace = await selectFolderAsWorkspace();

    // Close this window if a workspace was added
    if (workspace) {
      getCurrentWindow().close();
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
