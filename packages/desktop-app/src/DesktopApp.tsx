import React from 'react';
import { IconsProvider } from '@minddrop/icons';
import { AppSidebar } from './components';
import { useCurrentPath, useCurrentView } from './AppUiState';
import { ShowWindowOnRendered } from './utils';
import { DocumentView } from './views';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const view = useCurrentView();
  const path = useCurrentPath();

  return (
    <IconsProvider>
      <div className="app">
        <AppSidebar />
        <div className="app-content">
          <div data-tauri-drag-region className="app-drag-handle" />
          {view === 'document' && path && <DocumentView path={path} />}
        </div>
      </div>
      <ShowWindowOnRendered />
    </IconsProvider>
  );
};
