import { useCallback } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { ActionCard, Button } from '@minddrop/ui';
import { Workspaces } from '@minddrop/workspaces';
import { useTranslation } from '@minddrop/i18n';
import { BaseDirectory, Fs } from '@minddrop/core';

const WORKSPACE_NAME = 'MindDrop Workspace';

export const QuickStartCard: React.FC = () => {
  const { t } = useTranslation();

  const quickStart = useCallback(async () => {
    // Get path to Documents folder
    const documentsPath = await Fs.getDirPath(BaseDirectory.Documents);

    if (!(await Fs.exists(`${documentsPath}${WORKSPACE_NAME}`))) {
      // Create 'MindDrop Workspace' folder in documents
      await Workspaces.create(documentsPath, WORKSPACE_NAME);
    } else {
      // Add the selected directory as a workspace
      await Workspaces.add(`${documentsPath}${WORKSPACE_NAME}`);
    }

    // Close this window
    appWindow.close();
  }, []);

  return (
    <ActionCard
      icon="flash"
      title={t('quickStart')}
      description={t('quickStartWorkspaceDescription')}
      action={<Button label="start" variant="contained" onClick={quickStart} />}
    />
  );
};
