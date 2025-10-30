import React, { useCallback, useEffect, useState } from 'react';
import {
  Events,
  OpenMainContentView,
  OpenMainContentViewData,
} from '@minddrop/events';
import { MindDropApiProvider } from '@minddrop/extensions';
import { AppSidebar } from '@minddrop/feature-app-sidebar';
import { ItemTypeFeature } from '@minddrop/feature-item-type';
import { EmojiSkinTone, IconsProvider } from '@minddrop/icons';
import { ThemeProvider } from '@minddrop/theme';
import { TooltipProvider } from '@minddrop/ui-primitives';
import { DragImageProvider } from '@minddrop/utils';
import { AppUiState, useDefaultEmojiSkinTone } from './AppUiState';
import { ShowWindowOnRendered } from './utils';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const defaultEmojiSkinTone = useDefaultEmojiSkinTone();

  const handleChangeDefaultEmojiSkinTone = useCallback(
    (skinTone: EmojiSkinTone) => {
      AppUiState.set('defaultEmojiSkinTone', skinTone);
    },
    [],
  );

  return (
    <ThemeProvider>
      <TooltipProvider delay={1000} timeout={500}>
        <IconsProvider
          defaultEmojiSkinTone={defaultEmojiSkinTone}
          onDefaultEmojiSkinToneChange={handleChangeDefaultEmojiSkinTone}
        >
          <MindDropApiProvider>
            <DragImageProvider>
              <div className="app">
                <AppSidebar />
                <div className="app-content">
                  <MainContent />
                </div>
              </div>
              <ItemTypeFeature />
              <ShowWindowOnRendered />
            </DragImageProvider>
          </MindDropApiProvider>
        </IconsProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

const MainContent: React.FC = () => {
  const [view, setView] = useState<OpenMainContentViewData | null>(null);

  useEffect(() => {
    Events.addListener<OpenMainContentViewData>(
      OpenMainContentView,
      'desktop-app',
      ({ data }) => {
        setView(data);
      },
    );

    return () => {
      Events.removeListener(OpenMainContentView, 'desktop-app');
    };
  }, []);

  if (!view) return <div className="main-content" />;

  const { component: ViewComponent, props } = view;

  return (
    <div className="main-content">
      <ViewComponent {...props} />
    </div>
  );
};
