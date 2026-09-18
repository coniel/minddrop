import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Events } from '@minddrop/events';
import { ViewDescriptor, ViewSessions, Views } from '@minddrop/views';
import { ViewAreaState, applyOpenView } from '../applyOpenView';
import { applySetSubview } from '../applySetSubview';
import { matchesViewArea } from '../matchesViewArea';
import { SessionPane } from './SessionPane';
import { ViewAreaPane } from './ViewAreaPane';
import './ViewRenderer.css';

interface ViewRendererProps {
  /**
   * The id of the view area. Scopes which view events this renderer
   * responds to and announces.
   */
  viewAreaId: string;
}

const INITIAL_STATE: ViewAreaState = {
  sessionId: null,
  main: null,
  split: null,
  splitRatio: Views.constants.DefaultSplitRatio,
};

/**
 * Renders the views for a view area. Driven entirely by view events
 * (`Views.events.Open` / `Views.events.SetArea`) scoped to its `viewAreaId`,
 * and announces its state via `Views.events.AreaChanged`. Supports a split
 * (two-pane) layout with a draggable resize handle.
 */
export const ViewRenderer: FC<ViewRendererProps> = ({ viewAreaId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<ViewAreaState>(INITIAL_STATE);
  const [state, setState] = useState<ViewAreaState>(INITIAL_STATE);
  const activeSessionId = ViewSessions.useActiveId(viewAreaId);

  // Apply a new state, optionally announcing the change so listeners
  // (e.g. sessions) can mirror it. Not announced for transient updates
  // such as ongoing resize drags.
  const applyState = useCallback(
    (next: ViewAreaState, announce: boolean, replace?: boolean) => {
      // Store the new state on the ref and in component state
      stateRef.current = next;
      setState(next);

      // Announce the change to listeners for this view area
      if (announce) {
        Events.dispatch(Views.events.AreaChanged, {
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
    Events.addListener(Views.events.Open, listenerId, (data) => {
      // Ignore events targeting a different view area
      if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
        return;
      }

      applyState(applyOpenView(stateRef.current, data), true);
    });

    // Record the entity a view now shows within itself
    Events.addListener(Views.events.SetSubview, listenerId, (data) => {
      // Ignore events targeting a different view area
      if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
        return;
      }

      applyState(applySetSubview(stateRef.current, data), true, data.replace);
    });

    // Replace the entire state (e.g. when a session is activated)
    Events.addListener(Views.events.SetArea, listenerId, (data) => {
      // Ignore events targeting a different view area
      if (!matchesViewArea(data.viewAreaId, viewAreaId)) {
        return;
      }

      // Apply the incoming state
      applyState(
        {
          sessionId: data.sessionId ?? null,
          main: data.main,
          split: data.split,
          splitRatio: data.splitRatio,
        },
        true,
      );
    });

    // Announce that the listeners are ready so the initial content can
    // be restored (e.g. from the active session)
    Events.dispatch(Views.events.AreaReady, { viewAreaId });

    return () => {
      Events.removeListener(Views.events.Open, listenerId);
      Events.removeListener(Views.events.SetSubview, listenerId);
      Events.removeListener(Views.events.SetArea, listenerId);
    };
  }, [applyState, viewAreaId]);

  // Close the main (left) pane, promoting the split view to main
  const handleCloseMain = useCallback(() => {
    const current = stateRef.current;

    applyState(
      {
        ...current,
        main: current.split,
        split: null,
        splitRatio: 50,
      },
      true,
    );
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
        ...current,
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

        // Announce the final ratio so it is recorded on the active session
        Events.dispatch(Views.events.AreaChanged, {
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

  // The session the rendered views belong to. Restored state names
  // its own session, so that the views and the session they render
  // under change together rather than a moment apart. State opened
  // into a view area which has no session yet names none, and
  // belongs to the active session by default.
  const sessionId = state.sessionId ?? activeSessionId;

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
          <SessionPane
            key={viewInstanceKey(sessionId, main)}
            viewAreaId={viewAreaId}
            sessionId={sessionId}
            pane="main"
            descriptor={main}
          />
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
          <SessionPane
            key={viewInstanceKey(sessionId, split)}
            viewAreaId={viewAreaId}
            sessionId={sessionId}
            pane="split"
            descriptor={split}
          />
        </ViewAreaPane>
      </div>
    );
  }

  return (
    <div className="view-area">
      <SessionPane
        key={viewInstanceKey(sessionId, main)}
        viewAreaId={viewAreaId}
        sessionId={sessionId}
        pane="main"
        descriptor={main}
      />
    </div>
  );
};

/*
 * Identity of a pane's rendered view instance. Includes the session id
 * so switching sessions remounts the view even when both sessions show
 * the same view type, and the descriptor id so in-session navigation
 * between entities of the same view type remounts as well.
 */
function viewInstanceKey(
  sessionId: string | null,
  descriptor: ViewDescriptor,
): string {
  return `${sessionId ?? 'no-session'}:${descriptor.view}:${descriptor.id ?? ''}`;
}
