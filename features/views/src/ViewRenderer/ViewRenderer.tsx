import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Events } from '@minddrop/events';
import { IconButton } from '@minddrop/ui-primitives';
import {
  OpenViewEvent,
  OpenViewEventData,
  SetSubviewEvent,
  SetSubviewEventData,
  SetViewAreaEvent,
  SetViewAreaEventData,
  ViewAreaChangedEvent,
  ViewAreaChangedEventData,
  ViewAreaReadyEvent,
  ViewAreaReadyEventData,
  ViewDescriptor,
  Views,
} from '@minddrop/views';
import { TabViewStateProvider } from '../TabViewStateProvider';
import { ViewAreaState, applyOpenView } from '../applyOpenView';
import { applySetSubview } from '../applySetSubview';
import { matchesViewArea } from '../matchesViewArea';
import {
  type ViewAreaPane as ViewAreaPaneId,
  useActiveTabId,
} from '../tabs/TabSetsStore';
import { useBreadcrumbTrail } from '../tabs/resolveBreadcrumbTrail';
import { DEFAULT_SPLIT_RATIO } from '../tabs/tabsConstants';
import './ViewRenderer.css';

interface ViewRendererProps {
  /**
   * The id of the view area. Scopes which view events this renderer
   * responds to and announces.
   */
  viewAreaId: string;
}

const INITIAL_STATE: ViewAreaState = {
  main: null,
  split: null,
  splitRatio: DEFAULT_SPLIT_RATIO,
};

/**
 * Renders the views for a view area. Driven entirely by view events
 * (`OpenViewEvent` / `SetViewAreaEvent`) scoped to its `viewAreaId`,
 * and announces its state via `ViewAreaChangedEvent`. Supports a split
 * (two-pane) layout with a draggable resize handle.
 */
export const ViewRenderer: FC<ViewRendererProps> = ({ viewAreaId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<ViewAreaState>(INITIAL_STATE);
  const [state, setState] = useState<ViewAreaState>(INITIAL_STATE);

  // The active tab, used to remount views and scope their transient
  // state when switching tabs
  const activeTabId = useActiveTabId(viewAreaId);

  // Apply a new state, optionally announcing the change so listeners
  // (e.g. tabs) can mirror it. Not announced for transient updates
  // such as ongoing resize drags.
  const applyState = useCallback(
    (next: ViewAreaState, announce: boolean, replace?: boolean) => {
      // Store the new state on the ref and in component state
      stateRef.current = next;
      setState(next);

      // Announce the change to listeners for this view area
      if (announce) {
        Events.dispatch<ViewAreaChangedEventData>(ViewAreaChangedEvent, {
          viewAreaId,
          replace,
          ...next,
        });
      }
    },
    [viewAreaId],
  );

  useEffect(() => {
    const listenerId = `feature-views:view-area:${viewAreaId}`;

    // Open a view in the pane the open targets
    Events.addListener<OpenViewEventData>(
      OpenViewEvent,
      listenerId,
      ({ data }) => {
        // Ignore events targeting a different view area
        if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
          return;
        }

        applyState(applyOpenView(stateRef.current, data), true);
      },
    );

    // Record the entity a view now shows within itself
    Events.addListener<SetSubviewEventData>(
      SetSubviewEvent,
      listenerId,
      ({ data }) => {
        // Ignore events targeting a different view area
        if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
          return;
        }

        applyState(applySetSubview(stateRef.current, data), true, data.replace);
      },
    );

    // Replace the entire state (e.g. when a tab is activated)
    Events.addListener<SetViewAreaEventData>(
      SetViewAreaEvent,
      listenerId,
      ({ data }) => {
        // Ignore events targeting a different view area
        if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
          return;
        }

        // Apply the incoming state
        applyState(
          { main: data.main, split: data.split, splitRatio: data.splitRatio },
          true,
        );
      },
    );

    // Announce that the listeners are ready so the initial content can
    // be restored (e.g. by the tabs feature)
    Events.dispatch<ViewAreaReadyEventData>(ViewAreaReadyEvent, { viewAreaId });

    return () => {
      Events.removeListener(OpenViewEvent, listenerId);
      Events.removeListener(SetSubviewEvent, listenerId);
      Events.removeListener(SetViewAreaEvent, listenerId);
    };
  }, [applyState, viewAreaId]);

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
        Events.dispatch<ViewAreaChangedEventData>(ViewAreaChangedEvent, {
          viewAreaId,
          ...stateRef.current,
        });
      };

      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [applyState, viewAreaId],
  );

  const { main, split, splitRatio } = state;

  // Render an empty area when there is no main view
  if (!main) {
    return <div className="view-area" />;
  }

  // Render the split layout when a split view is active
  if (split) {
    return (
      <div ref={containerRef} className="view-area view-area-split">
        <ViewAreaPane
          position="left"
          onClose={handleCloseMain}
          onSwap={handleSwap}
          style={{ flex: splitRatio }}
        >
          <TabViewStateProvider viewAreaId={viewAreaId} pane="main">
            <Views.PaneProvider viewAreaId={viewAreaId} pane="main">
              <RegisteredView
                key={viewInstanceKey(activeTabId, main)}
                descriptor={main}
                viewAreaId={viewAreaId}
                pane="main"
              />
            </Views.PaneProvider>
          </TabViewStateProvider>
        </ViewAreaPane>
        <div
          className="view-area-resize-handle"
          onMouseDown={handleResizeStart}
          role="separator"
          aria-orientation="vertical"
        />
        <ViewAreaPane
          position="right"
          onClose={handleCloseSplit}
          onSwap={handleSwap}
          style={{ flex: 100 - splitRatio }}
        >
          <TabViewStateProvider viewAreaId={viewAreaId} pane="split">
            <Views.PaneProvider viewAreaId={viewAreaId} pane="split">
              <RegisteredView
                key={viewInstanceKey(activeTabId, split)}
                descriptor={split}
                viewAreaId={viewAreaId}
                pane="split"
              />
            </Views.PaneProvider>
          </TabViewStateProvider>
        </ViewAreaPane>
      </div>
    );
  }

  return (
    <div className="view-area">
      <TabViewStateProvider viewAreaId={viewAreaId} pane="main">
        <Views.PaneProvider viewAreaId={viewAreaId} pane="main">
          <RegisteredView
            key={viewInstanceKey(activeTabId, main)}
            descriptor={main}
            viewAreaId={viewAreaId}
            pane="main"
          />
        </Views.PaneProvider>
      </TabViewStateProvider>
    </div>
  );
};

/*
 * Identity of a pane's rendered view instance. Includes the tab id so
 * switching tabs remounts the view even when both tabs show the same
 * view type, and the descriptor id so in-tab navigation between
 * entities of the same view type remounts as well.
 */
function viewInstanceKey(
  tabId: string | null,
  descriptor: ViewDescriptor,
): string {
  return `${tabId ?? 'no-tab'}:${descriptor.view}:${descriptor.id ?? ''}`;
}

interface RegisteredViewProps {
  /**
   * The view to resolve and render.
   */
  descriptor: ViewDescriptor;

  /**
   * The id of the view area the view is rendered in.
   */
  viewAreaId: string;

  /**
   * The pane the view is rendered in.
   */
  pane: ViewAreaPaneId;
}

/**
 * Resolves a registered view by its type and renders it with its
 * props, providing the views it was reached through as its breadcrumb
 * trail.
 */
const RegisteredView: FC<RegisteredViewProps> = ({
  descriptor,
  pane,
  viewAreaId,
}) => {
  const registered = Views.use(descriptor.view);

  // Render the view's content through a stable element so that the
  // trail and subview updates below re-render only the providers
  const content = useMemo(() => {
    // Nothing to render when no view is registered for the type
    if (!registered) {
      return null;
    }

    return <registered.component {...descriptor.props} />;
  }, [registered, descriptor.props]);

  return (
    <ViewBreadcrumbs viewAreaId={viewAreaId} pane={pane}>
      <Views.SubviewProvider subview={descriptor.subview ?? null}>
        {content}
      </Views.SubviewProvider>
    </ViewBreadcrumbs>
  );
};

interface ViewBreadcrumbsProps {
  /**
   * The id of the view area the view is rendered in.
   */
  viewAreaId: string;

  /**
   * The pane the view is rendered in.
   */
  pane: ViewAreaPaneId;

  /**
   * The view content the trail applies to.
   */
  children: React.ReactNode;
}

/**
 * Provides the views a pane's view was reached through as its
 * breadcrumb trail.
 */
const ViewBreadcrumbs: FC<ViewBreadcrumbsProps> = ({
  viewAreaId,
  pane,
  children,
}) => {
  const breadcrumbs = useBreadcrumbTrail(viewAreaId, pane);

  return (
    <Views.BreadcrumbsProvider breadcrumbs={breadcrumbs}>
      {children}
    </Views.BreadcrumbsProvider>
  );
};

interface ViewAreaPaneProps {
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
   * Inline styles applied to the pane container, used for dynamic
   * flex sizing.
   */
  style?: React.CSSProperties;
}

/**
 * Wraps split view content with swap and close buttons.
 */
const ViewAreaPane: FC<ViewAreaPaneProps> = ({
  children,
  position,
  onClose,
  onSwap,
  style,
}) => (
  <div className="view-area-pane" style={style}>
    <div className="view-area-pane-header">
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
