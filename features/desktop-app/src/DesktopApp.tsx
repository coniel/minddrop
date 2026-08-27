import React, { useCallback, useEffect, useState } from 'react';
import {
  AppErrorEvent,
  AppErrorEventData,
  CloseAppSidebarEvent,
  CloseRightPanelEvent,
  Events,
  OpenAppSidebarEvent,
  OpenConfirmationDialogEvent,
  OpenConfirmationDialogEventData,
  OpenRightPanelEvent,
  ToggleWindowFillEvent,
} from '@minddrop/events';
import { DatabasesFeature } from '@minddrop/feature-databases';
import { DevTools, ScreenshotPicker } from '@minddrop/feature-dev-tools';
import { SearchFeature } from '@minddrop/feature-search';
import { SpacesFeature } from '@minddrop/feature-spaces';
import { TabsToolbar, ViewRenderer } from '@minddrop/feature-views';
import { EmojiSkinTone, IconsProvider } from '@minddrop/ui-icons';
import {
  ConfirmationDialog,
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastType,
  ToastViewport,
  TooltipProvider,
  useToastManager,
} from '@minddrop/ui-primitives';
import { DefaultViewAreaId, OpenViewEventData, Views } from '@minddrop/views';
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
      <ToastProvider>
        <IconsProvider
          defaultEmojiSkinTone={defaultEmojiSkinTone}
          onDefaultEmojiSkinToneChange={handleChangeDefaultEmojiSkinTone}
        >
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
          <ErrorToastFeature />
          <SpacesFeature />
          <SearchFeature />
          <DevTools />
          <ScreenshotPicker />
        </IconsProvider>
      </ToastProvider>
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
    Events.addListener(OpenRightPanelEvent, 'desktop-app', ({ data }) => {
      setView(data);
    });

    // Clear the right panel
    Events.addListener(CloseRightPanelEvent, 'desktop-app', () => {
      setView(null);
    });

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
  // Null until a dialog is requested, so there is no placeholder content
  const [dialogProps, setDialogProps] =
    useState<OpenConfirmationDialogEventData | null>(null);

  useEffect(() => {
    Events.addListener(
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

  if (!dialogProps) {
    return null;
  }

  return (
    <ConfirmationDialog {...dialogProps} open={open} onOpenChange={setOpen} />
  );
};

/**
 * Displays an error toast for each dispatched app error event.
 */
const ErrorToastFeature: React.FC = () => {
  const manager = useToastManager<AppErrorEventData>();

  useEffect(() => {
    // Show an error toast for each dispatched app error
    Events.addListener(AppErrorEvent, 'desktop-app', ({ data }) => {
      // Keep error toasts visible until dismissed manually
      manager.add({ type: 'error', timeout: 0, data });
    });

    return () => {
      Events.removeListener(AppErrorEvent, 'desktop-app');
    };
  }, [manager]);

  return (
    <ToastViewport>
      {manager.toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} type={resolveToastType(toast.type)}>
          <div>
            {/* Only render a title when the error has one */}
            {toast.data?.title && <ToastTitle>{toast.data.title}</ToastTitle>}
            {toast.data?.message && (
              <ToastDescription>{toast.data.message}</ToastDescription>
            )}
          </div>
          <ToastClose />
        </Toast>
      ))}
    </ToastViewport>
  );
};

// Coerces a toast's free-form type string to a known toast type
function resolveToastType(type?: string): ToastType {
  if (type === 'success' || type === 'error' || type === 'warning') {
    return type;
  }

  return 'default';
}
