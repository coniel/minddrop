import { useEffect, useState } from 'react';
import { IconsProvider } from '@minddrop/icons';
import { CoreProvider } from '@minddrop/core';
import { AppSidebar } from './AppSidebar';
import { initializeDesktopApp } from './initializeDesktopApp';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const [initializingApp, setInitializingApp] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initializeDesktopApp();

      setInitializingApp(false);
    };

    init();
  }, []);

  if (initializingApp) {
    return <div>Loading...</div>;
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
      </IconsProvider>
    </CoreProvider>
  );
};
