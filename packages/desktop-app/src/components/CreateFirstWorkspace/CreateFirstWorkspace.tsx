import { useEffect, useState } from 'react';
import { getCurrent } from '@tauri-apps/api/window';
import { getVersion } from '@tauri-apps/api/app';
import { IconsProvider } from '@minddrop/icons';
import { MindDropLogo, Text, Toolbar } from '@minddrop/ui';
import { useTranslation } from '@minddrop/i18n';
import { useToggle } from '@minddrop/utils';
import { OpenWorkspaceCard } from './OpenWorkspaceCard';
import { ShowWindowOnRendered } from '../../utils';
import { ThemeAppearanceSelect } from '../ThemeAppearanceSelect';
import { QuickStartCard } from './QuickStartCard';
import { CreateWorkspaceCard } from './CreateWorkspaceCard';
import { CreateWorkspaceForm } from '../CreateWorkspaceForm';
import './CreateFirstWorkspace.css';

function closeWindow() {
  getCurrent().close();
}

export const CreateFirstWorkspace: React.FC = () => {
  const { t } = useTranslation();
  const [appVersion, setAppVersion] = useState('');
  const [createWorkspace, toggleCreateWorkspace] = useToggle(false);

  useEffect(() => {
    async function init() {
      // Get app version
      setAppVersion(await getVersion());
    }

    init();
  }, []);

  // Wait for app version before rendering
  if (!appVersion) {
    return null;
  }

  return (
    <IconsProvider>
      <div className="app create-first-workspace">
        <div data-tauri-drag-region className="app-drag-handle" />
        <Toolbar>
          <ThemeAppearanceSelect />
        </Toolbar>
        <div className="content">
          <MindDropLogo size={118} />
          <h1>MindDrop</h1>
          <Text size="tiny" color="light">
            {t('app.version')} {appVersion}
          </Text>
          {createWorkspace ? (
            <CreateWorkspaceForm
              cancelButtonLabel={t('actions.back')}
              onClickCancel={toggleCreateWorkspace}
              onSuccess={closeWindow}
            />
          ) : (
            <>
              <div className="action-cards">
                <QuickStartCard />
                <CreateWorkspaceCard onClick={toggleCreateWorkspace} />
                <OpenWorkspaceCard />
              </div>
              <Text className="workspace-description" color="light">
                {t('workspaces.definition')}
              </Text>
            </>
          )}
        </div>
      </div>
      <ShowWindowOnRendered />
    </IconsProvider>
  );
};
