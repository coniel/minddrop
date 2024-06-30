import React, { useEffect } from 'react';
import { IconsProvider } from '@minddrop/icons';
import { DocumentView } from '@minddrop/documents';
import { Events } from '@minddrop/events';
import { MindDropApiProvider } from '@minddrop/extensions';
import { AppSidebar } from './components';
import { useCurrentPath, useCurrentView } from './AppUiState';
import { ShowWindowOnRendered } from './utils';
import { setActiveDocument } from './api';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const view = useCurrentView();
  const path = useCurrentPath();

  useEffect(() => {
    Events.addListener(
      'documents:document:wrap',
      'reopen-document-view-on-wrapped',
      ({ data }) => {
        if (path === data.oldPath) {
          setActiveDocument(data.newPath);
        }
      },
    );

    return () => {
      Events.removeListener(
        'documents:document:wrap',
        'reopen-document-view-on-wrapped',
      );
    };
  }, [path]);

  return (
    <IconsProvider>
      <MindDropApiProvider>
        <div className="app">
          <AppSidebar />
          <div className="app-content">
            <div data-tauri-drag-region className="app-drag-handle" />
            {view === 'document' && path && <DocumentView path={path} />}
          </div>
        </div>
        <ShowWindowOnRendered />
      </MindDropApiProvider>
    </IconsProvider>
  );
};
