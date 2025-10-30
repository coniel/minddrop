import React, { useCallback, useEffect, useState } from 'react';
import { Events } from '@minddrop/events';
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

type ViewEventData<P = any> = {
  component: React.ComponentType<P>;
  props?: P;
};

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
  const [view, setView] = useState<ViewEventData | null>(null);

  useEffect(() => {
    Events.addListener<ViewEventData>(
      'app:main-content:open',
      'desktop-app',
      ({ data }) => {
        setView(data);
      },
    );

    return () => {
      Events.removeListener('app:main-content:open', 'desktop-app');
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
