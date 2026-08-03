import React, { useCallback, useEffect, useState } from 'react';
import { DevTools } from '@minddrop/dev-tools';
import {
  CloseAppSidebarEvent,
  CloseRightPanelEvent,
  Events,
  OpenAppSidebarEvent,
  OpenConfirmationDialogEvent,
  OpenConfirmationDialogEventData,
  OpenRightPanelEvent,
  OpenViewEventData,
  ToggleWindowFillEvent,
} from '@minddrop/events';
import { MindDropApiProvider } from '@minddrop/extensions';
import { DatabasesFeature } from '@minddrop/feature-databases';
import { DesignsFeature } from '@minddrop/feature-designs';
import { SearchFeature } from '@minddrop/feature-search';
import { TabsToolbar, ViewRenderer } from '@minddrop/feature-views';
import { EmojiSkinTone, IconsProvider } from '@minddrop/ui-icons';
import { ConfirmationDialog, TooltipProvider } from '@minddrop/ui-primitives';
import { DefaultViewAreaId, Views } from '@minddrop/views';
import { AppSidebar } from './AppSidebar';
import { AppUiState } from './AppUiState';
import { NavToolbar } from './NavToolbar';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const defaultEmojiSkinTone = AppUiState.useValue('defaultEmojiSkinTone');
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

  const handleTopbarDoubleClick = useCallback((event: React.MouseEvent) => {
    // Ignore double-clicks on the toolbar controls, only the drag area
    // toggles the window fill
    if (
      (event.target as HTMLElement).closest(
        '.electrobun-webkit-app-region-no-drag',
      )
    ) {
      return;
    }

    Events.dispatch(ToggleWindowFillEvent);
  }, []);

  return (
    <TooltipProvider delay={1000} timeout={500}>
      <IconsProvider
        defaultEmojiSkinTone={defaultEmojiSkinTone}
        onDefaultEmojiSkinToneChange={handleChangeDefaultEmojiSkinTone}
      >
        <MindDropApiProvider>
          <div className="app">
            <div
              className="app-topbar electrobun-webkit-app-region-drag"
              onDoubleClick={handleTopbarDoubleClick}
            >
              <NavToolbar />
              <TabsToolbar viewAreaId={DefaultViewAreaId} shortcuts />
            </div>
            <div className="content-panels">
              {showSidebar && <AppSidebar />}
              <ViewRenderer viewAreaId={DefaultViewAreaId} />
              <RightPanel />
            </div>
          </div>
          <DatabasesFeature />
          <ConfirmationDialogFeature />
          <DesignsFeature />
          <SearchFeature />
          <DevTools />
        </MindDropApiProvider>
      </IconsProvider>
    </TooltipProvider>
  );
};

interface RegisteredViewProps {
  /**
   * The view to resolve and render, along with its props.
   */
  view: OpenViewEventData;
}

/**
 * Resolves a registered view by id and renders it with its props.
 */
const RegisteredView: React.FC<RegisteredViewProps> = ({ view }) => {
  const registered = Views.use(view.view);

  if (!registered) {
    return null;
  }

  const ViewComponent = registered.component;

  return <ViewComponent {...view.props} />;
};

const RightPanel: React.FC = () => {
  const [view, setView] = useState<OpenViewEventData | null>(null);

  useEffect(() => {
    // Show the view sent to the right panel
    Events.addListener<OpenViewEventData>(
      OpenRightPanelEvent,
      'desktop-app',
      ({ data }) => {
        setView(data);
      },
    );

    // Clear the right panel
    Events.addListener<OpenViewEventData>(
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

  // Render nothing when the right panel is empty
  if (!view) {
    return null;
  }

  return (
    <div className="right-panel">
      <RegisteredView view={view} />
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
