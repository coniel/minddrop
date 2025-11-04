import React, { useCallback, useEffect, useState } from 'react';
import {
  CloseRightPanel,
  Events,
  OpenConfirmationDialog,
  OpenConfirmationDialogData,
  OpenMainContentView,
  OpenMainContentViewData,
  OpenRightPanel,
} from '@minddrop/events';
import { MindDropApiProvider } from '@minddrop/extensions';
import { AppSidebar } from '@minddrop/feature-app-sidebar';
import { ItemTypeFeature } from '@minddrop/feature-item-type';
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
                  <AppSidebar />
                  <MainContent />
                  <RightPanel />
                </div>
              </div>
              <ItemTypeFeature />
              <ConfirmationDialogFeature />
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

const RightPanel: React.FC = () => {
  const [view, setView] = useState<OpenMainContentViewData | null>(null);

  useEffect(() => {
    Events.addListener<OpenMainContentViewData>(
      OpenRightPanel,
      'desktop-app',
      ({ data }) => {
        setView(data);
      },
    );

    Events.addListener<OpenMainContentViewData>(
      CloseRightPanel,
      'desktop-app',
      () => {
        setView(null);
      },
    );

    return () => {
      Events.removeListener(OpenRightPanel, 'desktop-app');
      Events.removeListener(CloseRightPanel, 'desktop-app');
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
  const [dialogProps, setDialogProps] = useState<OpenConfirmationDialogData>({
    title: '',
    message: '',
    onConfirm: () => {},
    confirmLabel: '',
  });

  useEffect(() => {
    Events.addListener<OpenConfirmationDialogData>(
      OpenConfirmationDialog,
      'desktop-app',
      ({ data }) => {
        setDialogProps(data);
        setOpen(true);
      },
    );

    return () => {
      Events.removeListener(OpenConfirmationDialog, 'desktop-app');
    };
  }, []);

  return (
    <ConfirmationDialog {...dialogProps} open={open} onOpenChange={setOpen} />
  );
};
