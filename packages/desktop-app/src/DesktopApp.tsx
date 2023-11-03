import React, { useEffect, useState } from 'react';
import { IconsProvider } from '@minddrop/icons';
import { CoreProvider } from '@minddrop/core';
import { AppSidebar } from './AppSidebar';
import { initializeDesktopApp } from './initializeDesktopApp';
import { useCurrentView } from './AppUiState';
import { ShowWindowOnRendered } from './utils';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const [initializingApp, setInitializingApp] = useState(true);
  const view = useCurrentView();

  useEffect(() => {
    let cleanup = () => {};

    const init = async () => {
      cleanup = await initializeDesktopApp();

      setInitializingApp(false);
    };

    init();

    return cleanup;
  }, []);

  if (initializingApp || view === null) {
    return <div>Loading...</div>;
  }

  return (
    <CoreProvider>
      <IconsProvider>
        <div className="app">
          {view && (
            <>
              <AppSidebar />
              <div className="app-content">
                <div data-tauri-drag-region className="app-drag-handle" />
                {view === 'no-valid-workspace' && <h1>No valid workspaces </h1>}
              </div>
            </>
          )}
        </div>
        <ShowWindowOnRendered />
      </IconsProvider>
    </CoreProvider>
  );
};
