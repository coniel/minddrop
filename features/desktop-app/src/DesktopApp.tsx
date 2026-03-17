import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DevTools } from '@minddrop/dev-tools';
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
import { DatabasesFeature } from '@minddrop/feature-databases';
import { DesignsFeature } from '@minddrop/feature-designs';
import { SearchFeature } from '@minddrop/feature-search';
import { EmojiSkinTone, IconsProvider } from '@minddrop/ui-icons';
import {
  ConfirmationDialog,
  IconButton,
  TooltipProvider,
} from '@minddrop/ui-primitives';
import { AppSidebar } from './AppSidebar';
import { AppUiState } from './AppUiState';
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

  return (
    <TooltipProvider delay={1000} timeout={500}>
      <IconsProvider
        defaultEmojiSkinTone={defaultEmojiSkinTone}
        onDefaultEmojiSkinToneChange={handleChangeDefaultEmojiSkinTone}
      >
        <MindDropApiProvider>
          <div className="app">
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
          <DevTools />
        </MindDropApiProvider>
      </IconsProvider>
    </TooltipProvider>
  );
};

const MainContent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mainView, setMainView] = useState<OpenMainContentViewEventData | null>(
    null,
  );
  const [splitView, setSplitView] =
    useState<OpenMainContentViewEventData | null>(null);

  // Split ratio as a percentage for the left pane (0-100)
  const [splitRatio, setSplitRatio] = useState(50);

  useEffect(() => {
    Events.addListener<OpenMainContentViewEventData>(
      OpenMainContentViewEvent,
      'desktop-app',
      ({ data }) => {
        // Route to split view or main content based on the split flag
        if (data.split) {
          setSplitView(data);
        } else {
          setMainView(data);
        }
      },
    );

    return () => {
      Events.removeListener(OpenMainContentViewEvent, 'desktop-app');
    };
  }, []);

  // Close the main (left) pane, promote split view to main
  const handleCloseMain = useCallback(() => {
    setMainView(splitView);
    setSplitView(null);
    setSplitRatio(50);
  }, [splitView]);

  // Close the split (right) pane
  const handleCloseSplit = useCallback(() => {
    setSplitView(null);
    setSplitRatio(50);
  }, []);

  // Swap the two split panes
  const handleSwap = useCallback(() => {
    setMainView(splitView);
    setSplitView(mainView);
    setSplitRatio(100 - splitRatio);
  }, [mainView, splitView, splitRatio]);

  // Handle resize handle drag
  const handleResizeStart = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      const container = containerRef.current;

      if (!container) {
        return;
      }

      const startX = event.clientX;
      const startRatio = splitRatio;
      const containerWidth = container.getBoundingClientRect().width;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const deltaPercent = (delta / containerWidth) * 100;
        const newRatio = Math.min(80, Math.max(20, startRatio + deltaPercent));

        setSplitRatio(newRatio);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };

      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [splitRatio],
  );

  if (!mainView) {
    return <div className="main-content" />;
  }

  const { component: MainViewComponent, props: mainProps } = mainView;

  // Render split layout when a split view is active
  if (splitView) {
    const { component: SplitViewComponent, props: splitProps } = splitView;

    return (
      <div ref={containerRef} className="main-content main-content-split">
        <SplitViewPane
          position="left"
          onClose={handleCloseMain}
          onSwap={handleSwap}
          style={{ flex: splitRatio }}
        >
          <MainViewComponent {...mainProps} />
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
          <SplitViewComponent {...splitProps} />
        </SplitViewPane>
      </div>
    );
  }

  return (
    <div className="main-content">
      <MainViewComponent {...mainProps} />
    </div>
  );
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
