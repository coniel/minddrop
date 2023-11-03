import { getVersion } from '@tauri-apps/api/app';
import { IconsProvider } from '@minddrop/icons';
import { MindDropLogo, Text, Toolbar } from '@minddrop/ui';
import { useCallback, useEffect, useState } from 'react';
import { OpenWorkspaceCard } from './OpenWorkspaceCard';
import { ShowWindowOnRendered } from '../utils';
import { ThemeAppearanceSelect } from '../ThemeAppearanceSelect';
import './CreateFirstWorkspace.css';
import { initializeDesktopApp } from '../initializeDesktopApp';
import { QuickStartCard } from './QuickStartCard';
import { CreateWorkspaceCard } from './CreateWorkspaceCard';
import { useTranslation } from '@minddrop/i18n';
import { CreateWorkspaceForm } from '../CreateWorkspaceForm/CreateWorkspaceForm';

export const CreateFirstWorkspace: React.FC = () => {
  const { t } = useTranslation();
  const [appVersion, setAppVersion] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [createWorkspace, setCreateWorkspace] = useState(false);

  useEffect(() => {
    let cleanup = () => {};

    async function init() {
      // Get app version
      setAppVersion(await getVersion());

      // Initialize app
      cleanup = await initializeDesktopApp();

      setInitialized(true);
    }

    init();

    return () => {
      cleanup();
    };
  }, []);

  const toggleCreateWorkspace = useCallback(
    () => setCreateWorkspace((value) => !value),
    [],
  );

  if (!initialized) {
    return 'Loading...';
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
            {t('version')} {appVersion}
          </Text>
          {createWorkspace ? (
            <CreateWorkspaceForm onClickBack={toggleCreateWorkspace} />
          ) : (
            <>
              <div className="action-cards">
                <QuickStartCard />
                <CreateWorkspaceCard onClick={toggleCreateWorkspace} />
                <OpenWorkspaceCard />
              </div>
              <Text className="workspace-description" color="light">
                {t('workspaceDefinition')}
              </Text>
            </>
          )}
        </div>
      </div>
      <ShowWindowOnRendered />
    </IconsProvider>
  );
};
