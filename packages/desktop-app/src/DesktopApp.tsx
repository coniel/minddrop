import React, { useCallback } from 'react';
import { MindDropApiProvider } from '@minddrop/extensions';
import { ItemTypeView, NewItemTypeDialog } from '@minddrop/feature-item-type';
import { EmojiSkinTone, IconsProvider } from '@minddrop/icons';
import { ThemeProvider } from '@minddrop/theme';
import { TooltipProvider } from '@minddrop/ui-elements';
import { DragImageProvider } from '@minddrop/utils';
import {
  AppUiState,
  useCurrentView,
  useDefaultEmojiSkinTone,
} from './AppUiState';
import { ShowWindowOnRendered } from './utils';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const view = useCurrentView();
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
              <div className="app">
                <div className="app-content">
                  <div className="main-content">
                    {view === 'item-type' && <ItemTypeView />}
                  </div>
                </div>
              </div>
              <NewItemTypeDialog />
              <ShowWindowOnRendered />
            </DragImageProvider>
          </MindDropApiProvider>
        </IconsProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};
