import { useCallback } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { ActionCard, Button } from '@minddrop/ui-elements';
import { Workspaces } from '@minddrop/workspaces';
import { useTranslation } from '@minddrop/i18n';
import { BaseDirectory, Fs } from '@minddrop/file-system';

const WORKSPACE_NAME = 'MindDrop Workspace';

export const QuickStartCard: React.FC = () => {
  const { t } = useTranslation('workspaces.actions.quickstart');

  const quickStart = useCallback(async () => {
    // Get path to Documents folder
    const documentsPath = await Fs.getBaseDirPath(BaseDirectory.Documents);

    if (!(await Fs.exists(Fs.concatPath(documentsPath, WORKSPACE_NAME)))) {
      // Create 'MindDrop Workspace' folder in documents
      await Workspaces.create(documentsPath, WORKSPACE_NAME);
    } else {
      // Add the selected directory as a workspace
      await Workspaces.add(`${documentsPath}${WORKSPACE_NAME}`);
    }

    // Close this window
    getCurrentWindow().close();
  }, []);

  return (
    <ActionCard
      icon="flash"
      title={t('label')}
      description={t('description')}
      action={
        <Button label={t('action')} variant="contained" onClick={quickStart} />
      }
    />
  );
};
