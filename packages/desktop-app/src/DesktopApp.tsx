import React, { useCallback } from 'react';
import { MindDropApiProvider } from '@minddrop/extensions';
import { EmojiSkinTone, IconsProvider } from '@minddrop/icons';
import { ThemeProvider } from '@minddrop/theme';
import { CollectionView } from '@minddrop/ui-desktop';
import { ThemePanel, TooltipProvider } from '@minddrop/ui-elements';
import { DragImageProvider } from '@minddrop/utils';
import {
  AppUiState,
  useCurrentDocumentId,
  useCurrentView,
  useDefaultEmojiSkinTone,
} from './AppUiState';
import { AppSidebar } from './components';
import { ShowWindowOnRendered } from './utils';
import { DocumentView } from './views';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const view = useCurrentView();
  const documentId = useCurrentDocumentId();
  const defaultEmojiSkinTone = useDefaultEmojiSkinTone();

  const handleChangeDefaultEmojiSkinTone = useCallback(
    (skinTone: EmojiSkinTone) => {
      AppUiState.set('defaultEmojiSkinTone', skinTone);
    },
    [],
  );

  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={1000} skipDelayDuration={500}>
        <IconsProvider
          defaultEmojiSkinTone={defaultEmojiSkinTone}
          onDefaultEmojiSkinToneChange={handleChangeDefaultEmojiSkinTone}
        >
          <MindDropApiProvider>
            <DragImageProvider>
              <ThemePanel />
              <div className="app">
                <AppSidebar />
                <div className="app-content">
                  {view === 'collection' && documentId && (
                    <CollectionView path={documentId} />
                  )}
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
    </ThemeProvider>
  );
};
