import React, { useEffect, useState } from 'react';
import { AppSidebar } from '@minddrop/app-ui';
import { IconsProvider } from '@minddrop/icons';
import { CoreProvider, initializeCore } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { useCurrentView } from '@minddrop/app';
import { FileStorageApi } from '@minddrop/files';
import { ExtensionConfig } from '@minddrop/extensions';
import { initializeApp, registerViews } from '../initializeApp';
import { useThemeAppearance } from '@minddrop/theme';
import { ResourceStorageAdapterConfig } from '@minddrop/resources';
import { BackendUtilsApi } from '@minddrop/utils';
import './MindDrop.css';

export interface MindDropProps {
  /**
   * The application instance ID.
   */
  appId: string;

  /**
   * The default resource storage adapter.
   */
  resourceStorageAdapter: ResourceStorageAdapterConfig;

  /**
   * The default file storage adapter.
   */
  fileStorageAdapter: FileStorageApi;

  /**
   * The default backend utils adapter.
   */
  backendUtilsAdapter: BackendUtilsApi;

  /**
   * The extension configs of installed extensions.
   */
  extensions: ExtensionConfig[];
}

// Initialize internationalization
initializeI18n();

// Register the default views
registerViews(initializeCore({ appId: 'app', extensionId: 'app' }));

export const MindDrop: React.FC<MindDropProps> = ({
  appId,
  resourceStorageAdapter,
  fileStorageAdapter,
  backendUtilsAdapter,
  extensions,
}) => {
  const { view, instance } = useCurrentView();
  const [initialized, setInitialized] = useState(false);
  const themeAppearance = useThemeAppearance();

  useEffect(() => {
    async function initialize() {
      await initializeApp({
        appId,
        resourceStorageAdapter,
        fileStorageAdapter,
        backendUtilsAdapter,
        installedExtensions: extensions,
      });
      setInitialized(true);
    }

    initialize();
  }, []);

  useEffect(() => {
    // Toggle the theme appearance class on <body>
    // whenever the theme appearance value is changes.
    if (themeAppearance === 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  }, [themeAppearance]);

  if (!initialized) {
    return <div>Loading</div>;
  }

  const View = view.component;

  return (
    <CoreProvider appId={appId}>
      <IconsProvider>
        <div className="minddrop">
          <AppSidebar />
          <div className="app-content">
            <div className="app-drag-handle" />
            {view && <View instanceId={instance ? instance.id : undefined} />}
          </div>
        </div>
      </IconsProvider>
    </CoreProvider>
  );
};
