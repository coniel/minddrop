import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DevTools } from '@minddrop/dev-tools';
import {
  CloseAppSidebarEvent,
  CloseRightPanelEvent,
  Events,
  MainContentChangedEvent,
  MainContentChangedEventData,
  MainContentReadyEvent,
  MainContentViewDescriptor,
  OpenAppSidebarEvent,
  OpenConfirmationDialogEvent,
  OpenConfirmationDialogEventData,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
  OpenRightPanelEvent,
  SetMainContentEvent,
  SetMainContentEventData,
  ToggleWindowFillEvent,
} from '@minddrop/events';
import { MindDropApiProvider } from '@minddrop/extensions';
import { DatabasesFeature } from '@minddrop/feature-databases';
import { DesignsFeature } from '@minddrop/feature-designs';
import { SearchFeature } from '@minddrop/feature-search';
import { EmojiSkinTone, IconsProvider } from '@minddrop/ui-icons';
import {
  ConfirmationDialog,
  IconButton,
  TooltipProvider,
} from '@minddrop/ui-primitives';
import { MainContentViews } from '@minddrop/views';
import { AppSidebar } from './AppSidebar';
import { AppUiState } from './AppUiState';
import { NavToolbar } from './NavToolbar';
import { TabsFeature } from './TabsFeature';
import { TabsToolbar } from './TabsToolbar';
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
              <TabsToolbar />
            </div>
            <div className="content-panels">
              {showSidebar && <AppSidebar />}
              <MainContent />
              <RightPanel />
            </div>
          </div>
          <DatabasesFeature />
          <ConfirmationDialogFeature />
          <DesignsFeature />
          <SearchFeature />
          <TabsFeature />
          <DevTools />
        </MindDropApiProvider>
      </IconsProvider>
    </TooltipProvider>
  );
};

const INITIAL_MAIN_CONTENT_STATE: SetMainContentEventData = {
  main: null,
  split: null,
  splitRatio: 50,
};

/**
 * Renders the main content area. Driven entirely by events
 * (`OpenMainContentViewEvent` / `SetMainContentEvent`) and announces its
 * state via `MainContentChangedEvent`. Knows nothing about tabs.
 */
const MainContent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SetMainContentEventData>(INITIAL_MAIN_CONTENT_STATE);
  const [state, setState] = useState<SetMainContentEventData>(
    INITIAL_MAIN_CONTENT_STATE,
  );

  // Applies a new state, optionally announcing the change so listeners
  // (e.g. tabs) can mirror it. Not announced for transient updates
  // such as ongoing resize drags.
  const applyState = useCallback(
    (next: SetMainContentEventData, announce: boolean) => {
      stateRef.current = next;
      setState(next);

      if (announce) {
        Events.dispatch<MainContentChangedEventData>(
          MainContentChangedEvent,
          next,
        );
      }
    },
    [],
  );

  useEffect(() => {
    // Open a view in the main pane (replacing any split) or the split pane
    Events.addListener<OpenMainContentViewEventData>(
      OpenMainContentViewEvent,
      'desktop-app',
      ({ data }) => {
        const current = stateRef.current;
        const descriptor: MainContentViewDescriptor = {
          view: data.view,
          id: data.id,
          props: data.props,
          title: data.title,
          icon: data.icon,
        };

        if (data.split) {
          applyState(
            {
              ...current,
              split: descriptor,
              splitRatio: data.splitRatio ?? current.splitRatio,
            },
            true,
          );
        } else {
          applyState({ main: descriptor, split: null, splitRatio: 50 }, true);
        }
      },
    );

    // Replace the entire state (e.g. when a tab is activated)
    Events.addListener<SetMainContentEventData>(
      SetMainContentEvent,
      'desktop-app',
      ({ data }) => {
        applyState(data, true);
      },
    );

    // Announce that the listeners are ready so the initial content
    // can be restored (e.g. by the tabs feature)
    Events.dispatch(MainContentReadyEvent);

    return () => {
      Events.removeListener(OpenMainContentViewEvent, 'desktop-app');
      Events.removeListener(SetMainContentEvent, 'desktop-app');
    };
  }, [applyState]);

  // Close the main (left) pane, promoting the split view to main
  const handleCloseMain = useCallback(() => {
    const current = stateRef.current;

    applyState({ main: current.split, split: null, splitRatio: 50 }, true);
  }, [applyState]);

  // Close the split (right) pane
  const handleCloseSplit = useCallback(() => {
    const current = stateRef.current;

    applyState({ ...current, split: null, splitRatio: 50 }, true);
  }, [applyState]);

  // Swap the two split panes
  const handleSwap = useCallback(() => {
    const current = stateRef.current;

    applyState(
      {
        main: current.split,
        split: current.main,
        splitRatio: 100 - current.splitRatio,
      },
      true,
    );
  }, [applyState]);

  // Handle resize handle drag
  const handleResizeStart = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      const container = containerRef.current;

      if (!container) {
        return;
      }

      const startX = event.clientX;
      const startRatio = stateRef.current.splitRatio;
      const containerWidth = container.getBoundingClientRect().width;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const deltaPercent = (delta / containerWidth) * 100;
        const newRatio = Math.min(80, Math.max(20, startRatio + deltaPercent));

        // Update the visual ratio only; announce on release
        applyState({ ...stateRef.current, splitRatio: newRatio }, false);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';

        // Announce the final ratio so it is recorded on the active tab
        Events.dispatch<MainContentChangedEventData>(
          MainContentChangedEvent,
          stateRef.current,
        );
      };

      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [applyState],
  );

  const { main, split, splitRatio } = state;

  if (!main) {
    return <div className="main-content" />;
  }

  // Render split layout when a split view is active
  if (split) {
    return (
      <div ref={containerRef} className="main-content main-content-split">
        <SplitViewPane
          position="left"
          onClose={handleCloseMain}
          onSwap={handleSwap}
          style={{ flex: splitRatio }}
        >
          <MainContentViewRenderer view={main} />
        </SplitViewPane>
        <div
          className="split-view-resize-handle"
          onMouseDown={handleResizeStart}
          role="separator"
          aria-orientation="vertical"
        />
        <SplitViewPane
          position="right"
          onClose={handleCloseSplit}
          onSwap={handleSwap}
          style={{ flex: 100 - splitRatio }}
        >
          <MainContentViewRenderer view={split} />
        </SplitViewPane>
      </div>
    );
  }

  return (
    <div className="main-content">
      <MainContentViewRenderer view={main} />
    </div>
  );
};

interface MainContentViewRendererProps {
  /**
   * The view to render, resolved to a component from the registered
   * main content views by its `view` id.
   */
  view: MainContentViewDescriptor;
}

/** Resolves a main content view by id and renders it with its props. */
const MainContentViewRenderer: React.FC<MainContentViewRendererProps> = ({
  view,
}) => {
  const registered = MainContentViews.use(view.view);

  if (!registered) {
    return null;
  }

  const ViewComponent = registered.component;

  return <ViewComponent {...view.props} />;
};

interface SplitViewPaneProps {
  /**
   * The content to render inside the pane.
   */
  children: React.ReactNode;

  /**
   * Which side of the split this pane is on.
   */
  position: 'left' | 'right';

  /**
   * Called when the pane's close button is clicked.
   */
  onClose: () => void;

  /**
   * Called when the swap button is clicked.
   */
  onSwap: () => void;

  /**
   * Inline styles applied to the pane container,
   * used for dynamic flex sizing.
   */
  style?: React.CSSProperties;
}

/** Wraps split view content with swap and close buttons. */
const SplitViewPane: React.FC<SplitViewPaneProps> = ({
  children,
  position,
  onClose,
  onSwap,
  style,
}) => (
  <div className="main-content-pane" style={style}>
    <div className="main-content-pane-header">
      <IconButton
        icon={position === 'left' ? 'arrow-right' : 'arrow-left'}
        label="actions.swapSplitPosition"
        onClick={onSwap}
        size="sm"
      />
      <IconButton icon="x" label="actions.close" onClick={onClose} size="sm" />
    </div>
    {children}
  </div>
);

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

  if (!view) {
    return null;
  }

  return (
    <div className="right-panel">
      <MainContentViewRenderer view={view} />
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
