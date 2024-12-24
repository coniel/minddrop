import React from 'react';
import { MindDropApiProvider } from '@minddrop/extensions';
import { IconsProvider } from '@minddrop/icons';
import { TooltipProvider } from '@minddrop/ui-elements';
import { DragImageProvider } from '@minddrop/utils';
import { useCurrentDocumentId, useCurrentView } from './AppUiState';
import { AppSidebar } from './components';
import { ShowWindowOnRendered } from './utils';
import { DocumentView } from './views';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const view = useCurrentView();
  const documentId = useCurrentDocumentId();

  return (
    <TooltipProvider delayDuration={1000} skipDelayDuration={500}>
      <IconsProvider>
        <MindDropApiProvider>
          <DragImageProvider>
            <div className="app">
              <AppSidebar />
              <div className="app-content">
                {view === 'document' && documentId && (
                  <DocumentView id={documentId} />
                )}
              </div>
            </div>
            <ShowWindowOnRendered />
          </DragImageProvider>
        </MindDropApiProvider>
      </IconsProvider>
    </TooltipProvider>
  );
};
