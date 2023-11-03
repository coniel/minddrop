import { useCallback } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { appWindow } from '@tauri-apps/api/window';
import { ActionCard, Button } from '@minddrop/ui';
import { Workspaces } from '@minddrop/workspaces';
import { useTranslation } from '@minddrop/i18n';

export const OpenWorkspaceCard: React.FC = () => {
  const { t } = useTranslation();

  const openDirSelection = useCallback(async () => {
    // Open a selection dialog for a directory
    const selected = await open({
      multiple: false,
      directory: true,
    });

    if (typeof selected === 'string') {
      // Add the selected directory as a workspace
      await Workspaces.add(selected);

      // Close this window
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
