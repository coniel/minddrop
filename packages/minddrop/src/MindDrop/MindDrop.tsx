import React, { useEffect, useState } from 'react';
import { AppSidebar } from '@minddrop/app-ui';
import { IconsProvider } from '@minddrop/icons';
import { CoreProvider } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { useCurrentView } from '@minddrop/app';
import { ExtensionConfig } from '@minddrop/extensions';
import { initializeApp, registerViews } from '../initializeApp';
import '@minddrop/theme';
import './MindDrop.css';
import { ResourceStorageAdapterConfig } from '@minddrop/resources';

export interface MindDropProps {
  /**
   * The application instance ID.
   */
  appId: string;

  /**
   * The default resource storage adapter config.
   */
  resourceStorageAdapter: ResourceStorageAdapterConfig;

  /**
   * The extension configs of installed extensions.
   */
  extensions: ExtensionConfig[];
}

// Initialize internationalization
initializeI18n();

// Register the default views
registerViews();

export const MindDrop: React.FC<MindDropProps> = ({
  appId,
  resourceStorageAdapter,
  extensions,
}) => {
  const { view, instance } = useCurrentView();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initialize() {
      await initializeApp(resourceStorageAdapter, extensions);
      setInitialized(true);
    }

    initialize();
  }, []);

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
            {view && <View instanceId={instance ? instance.id : undefined} />}
          </div>
        </div>
      </IconsProvider>
    </CoreProvider>
  );
};
