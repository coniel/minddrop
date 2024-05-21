import React from 'react';
import { IconsProvider } from '@minddrop/icons';
import { CoreProvider } from '@minddrop/core';
import { AppSidebar } from './components';
import { useCurrentPath, useCurrentView } from './AppUiState';
import { ShowWindowOnRendered } from './utils';
import { PageView } from './views';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const view = useCurrentView();
  const path = useCurrentPath();

  if (!view) {
    return null;
  }

  return (
    <CoreProvider>
      <IconsProvider>
        <div className="app">
          <AppSidebar />
          <div className="app-content">
            <div data-tauri-drag-region className="app-drag-handle" />
            {view === 'page' && path && <PageView path={path} />}
          </div>
        </div>
        <ShowWindowOnRendered />
      </IconsProvider>
    </CoreProvider>
  );
};
