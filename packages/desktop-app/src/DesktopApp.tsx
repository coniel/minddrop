import React, { useCallback, useEffect, useState } from 'react';
import {
  CloseAppSidebarEvent,
  CloseRightPanelEvent,
  Events,
  OpenAppSidebarEvent,
  OpenConfirmationDialogEvent,
  OpenConfirmationDialogEventData,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
  OpenRightPanelEvent,
} from '@minddrop/events';
import { MindDropApiProvider } from '@minddrop/extensions';
import { AppSidebar } from '@minddrop/feature-app-sidebar';
import { DatabasesFeature } from '@minddrop/feature-databases';
import { DesignStudioFeature } from '@minddrop/feature-design-studio';
import { EmojiSkinTone, IconsProvider } from '@minddrop/icons';
import { ThemeProvider } from '@minddrop/theme';
import {
  ConfirmationDialog,
  Panel,
  TooltipProvider,
} from '@minddrop/ui-primitives';
import { DragImageProvider } from '@minddrop/utils';
import { AppUiState, useDefaultEmojiSkinTone } from './AppUiState';
import { ShowWindowOnRendered } from './utils';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const defaultEmojiSkinTone = useDefaultEmojiSkinTone();
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    Events.addListener(CloseAppSidebarEvent, 'desktop-app', () => {
      setShowSidebar(false);
    });

    Events.addListener(OpenAppSidebarEvent, 'desktop-app', () => {
      setShowSidebar(true);
    });

    return () => {
      Events.removeListener(CloseAppSidebarEvent, 'desktop-app');
      Events.removeListener(OpenAppSidebarEvent, 'desktop-app');
    };
  }, []);

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
                <Panel className="toolbar-panel"></Panel>
                <div className="content-panels">
                  {showSidebar && <AppSidebar />}
                  <MainContent />
                  <RightPanel />
                </div>
              </div>
              <DatabasesFeature />
              <ConfirmationDialogFeature />
              <ShowWindowOnRendered />
              <DesignStudioFeature />
            </DragImageProvider>
          </MindDropApiProvider>
        </IconsProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

const MainContent: React.FC = () => {
  const [view, setView] = useState<OpenMainContentViewEventData | null>(null);

  useEffect(() => {
    Events.addListener<OpenMainContentViewEventData>(
      OpenMainContentViewEvent,
      'desktop-app',
      ({ data }) => {
        setView(data);
      },
    );

    return () => {
      Events.removeListener(OpenMainContentViewEvent, 'desktop-app');
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

const RightPanel: React.FC = () => {
  const [view, setView] = useState<OpenMainContentViewEventData | null>(null);

  useEffect(() => {
    Events.addListener<OpenMainContentViewEventData>(
      OpenRightPanelEvent,
      'desktop-app',
      ({ data }) => {
        setView(data);
      },
    );

    Events.addListener<OpenMainContentViewEventData>(
      CloseRightPanelEvent,
      'desktop-app',
      () => {
        setView(null);
      },
    );

    return () => {
      Events.removeListener(OpenRightPanelEvent, 'desktop-app');
      Events.removeListener(CloseRightPanelEvent, 'desktop-app');
    };
  }, []);

  if (!view) return null;

  const { component: ViewComponent, props } = view;

  return (
    <div className="right-panel">
      <ViewComponent {...props} />
    </div>
  );
};

const ConfirmationDialogFeature: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [dialogProps, setDialogProps] =
    useState<OpenConfirmationDialogEventData>({
      title: '',
      message: '',
      onConfirm: () => {},
      confirmLabel: '',
    });

  useEffect(() => {
    Events.addListener<OpenConfirmationDialogEventData>(
      OpenConfirmationDialogEvent,
      'desktop-app',
      ({ data }) => {
        setDialogProps(data);
        setOpen(true);
      },
    );

    return () => {
      Events.removeListener(OpenConfirmationDialogEvent, 'desktop-app');
    };
  }, []);

  return (
    <ConfirmationDialog {...dialogProps} open={open} onOpenChange={setOpen} />
  );
};
