import React from 'react';
import { IconsProvider } from '@minddrop/icons';
import { CoreProvider } from '@minddrop/core';
import { AppSidebar } from './components';
import { useCurrentView } from './AppUiState';
import { ShowWindowOnRendered } from './utils';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const view = useCurrentView();

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
          </div>
        </div>
        <ShowWindowOnRendered />
      </IconsProvider>
    </CoreProvider>
  );
};
