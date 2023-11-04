import { useCallback } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { ActionCard, Button } from '@minddrop/ui';
import { useTranslation } from '@minddrop/i18n';
import { selectFolderAsWorkspace } from '../../selectFolderAsWorkspace';

export const OpenWorkspaceCard: React.FC = () => {
  const { t } = useTranslation();

  const openDirSelection = useCallback(async () => {
    // Add workspace from folder selection
    const workspace = await selectFolderAsWorkspace();

    // Close this window if a workspace was added
    if (workspace) {
      appWindow.close();
    }
  }, []);

  return (
    <ActionCard
      icon="folder"
      title={t('openWorkspace')}
      description={t('openWorkspaceDescription')}
      action={
        <Button label="open" variant="contained" onClick={openDirSelection} />
      }
    />
  );
};
