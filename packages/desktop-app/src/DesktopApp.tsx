import React from 'react';
import { IconsProvider } from '@minddrop/icons';
import { MindDropApiProvider } from '@minddrop/extensions';
import { TooltipProvider } from '@minddrop/ui-elements';
import { DocumentView } from './views';
import { AppSidebar } from './components';
import { useCurrentDocumentId, useCurrentView } from './AppUiState';
import { ShowWindowOnRendered } from './utils';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const view = useCurrentView();
  const documentId = useCurrentDocumentId();

  return (
    <TooltipProvider delayDuration={800} skipDelayDuration={500}>
      <IconsProvider>
        <MindDropApiProvider>
          <div className="app">
            <AppSidebar />
            <div className="app-content">
              <div data-tauri-drag-region className="app-drag-handle" />
              {view === 'document' && documentId && (
                <DocumentView id={documentId} />
              )}
            </div>
          </div>
          <ShowWindowOnRendered />
        </MindDropApiProvider>
      </IconsProvider>
    </TooltipProvider>
  );
};
