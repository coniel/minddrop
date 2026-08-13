import { useCallback, useEffect } from 'react';
import { Design, Designs } from '@minddrop/designs-legacy';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
  SetNavToolbarWidthEvent,
} from '@minddrop/events';
import {
  CanvasProvider,
  CanvasToolbar,
  useFitOnNodesReady,
} from '@minddrop/ui-canvas';
import { Panel } from '@minddrop/ui-primitives';
import { DefaultViewName, OpenViewEvent } from '@minddrop/views';
import { DesignDashboard } from '../DesignDashboard';
import { DesignStudioLeftPanel } from '../DesignStudioLeftPanel';
import { DesignStudioRootElement } from '../DesignStudioRootElement';
import {
  DesignStudioStore,
  deleteHighlightedElement,
  renameDesign,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { DesignStudioViewport } from '../DesignStudioViewport';
import { ElementStyleEditor } from '../ElementStyleEditor';
import { LayoutFrame } from '../LayoutFrame/LayoutFrame';
import { designStudioCanvasStore } from '../designStudioCanvas';
import { OpenDesignStudioEventData } from '../events';
import { FlatRootDesignElement } from '../types';
import './DesignStudio.css';

// Width of the left panel, matched by the nav toolbar (see DesignStudio.css)
const LEFT_PANEL_WIDTH = 300;

export const DesignStudio: React.FC<OpenDesignStudioEventData> = ({
  backEvent,
  backEventData,
  backButtonLabel,
  designId,
}) => {
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );
  const design = useDesignStudioStore((state) => state.design);
  const isDesignOpen = Boolean(design);

  // Open the design specified by the open event
  useEffect(() => {
    if (!designId) {
      return;
    }

    openDesign(designId);
  }, [designId]);

  // Delete the highlighted element on Delete/Backspace, clear
  // the highlight on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle shortcuts when typing in an input
      const tag = (event.target as HTMLElement).tagName;

      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
      }

      // Escape clears the selection overlay
      if (event.key === 'Escape') {
        DesignStudioStore.clearHighlight();

        return;
      }

      if (event.key !== 'Delete' && event.key !== 'Backspace') {
        return;
      }

      if (!DesignStudioStore.getHighlightedElementId()) {
        return;
      }

      event.preventDefault();

      // Deleting a frame's root deletes the entire layout
      deleteHighlightedElement({ allowRootDelete: true });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close the app sidebar when the design studio is opened
  useEffect(() => {
    Events.dispatch(CloseAppSidebarEvent);

    return () => {
      Events.dispatch(OpenAppSidebarEvent);
    };
  }, []);

  // Match the nav toolbar to the left panel, which is only shown
  // while a design is open
  useEffect(() => {
    Events.dispatch(SetNavToolbarWidthEvent, {
      width: isDesignOpen ? LEFT_PANEL_WIDTH : 0,
    });
  }, [isDesignOpen]);

  // Close any open design when the studio unmounts so the next
  // open starts at the dashboard
  useEffect(() => {
    return () => {
      DesignStudioStore.clear();
    };
  }, []);

  const handleClickBack = useCallback(() => {
    if (backEvent) {
      Events.dispatch(backEvent, backEventData);
    } else {
      // No back event provided, navigate to an empty view
      // to unmount the design studio and reopen the sidebar.
      Events.dispatch(OpenViewEvent, {
        view: DefaultViewName,
      });
    }
  }, [backEvent, backEventData]);

  // Return to the origin view when the design was opened
  // directly, otherwise close the design to show the dashboard
  const handleCloseDesign = useCallback(() => {
    if (designId) {
      handleClickBack();

      return;
    }

    DesignStudioStore.clear();
  }, [designId, handleClickBack]);

  // No design open: show the dashboard
  if (!design) {
    return <DesignDashboard onClickBack={handleClickBack} />;
  }

  return (
    <div className="design-studio">
      <Panel className="design-studio-left-panel">
        <DesignStudioLeftPanel
          backButtonLabel={designId ? backButtonLabel : undefined}
          onClickBack={handleCloseDesign}
        />
      </Panel>
      <CanvasProvider store={designStudioCanvasStore}>
        <DesignStudioWorkspace design={design} />
      </CanvasProvider>
      <Panel className="design-studio-right-panel">
        {selectedElementId && <ElementStyleEditor />}
      </Panel>
    </div>
  );
};

interface DesignStudioWorkspaceProps {
  /**
   * The design open in the studio.
   */
  design: Design;
}

/**
 * Renders the studio workspace: the canvas viewport with the
 * design's layout frames, its name field and canvas toolbar.
 */
const DesignStudioWorkspace: React.FC<DesignStudioWorkspaceProps> = ({
  design,
}) => {
  // Fit the design's layouts into view when the workspace opens
  useFitOnNodesReady(design.layouts.map((layout) => layout.id));

  return (
    <div className="design-studio-workspace">
      <DesignStudioViewport name={design.name} onNameChange={renameDesign}>
        {design.layouts.map((layout) => (
          <LayoutFrame key={layout.id} layoutId={layout.id}>
            <LayoutRootElement />
          </LayoutFrame>
        ))}
      </DesignStudioViewport>

      {/* Canvas controls */}
      <CanvasToolbar />
    </div>
  );
};

/**
 * Renders the root element of the layout provided by the
 * surrounding layout frame's context.
 */
const LayoutRootElement: React.FC = () => {
  const rootElement = useElement<FlatRootDesignElement>('root');

  if (!rootElement) {
    return null;
  }

  return <DesignStudioRootElement element={rootElement} />;
};

/**
 * Opens the design in the editor. Does nothing when the design
 * does not exist.
 */
function openDesign(designId: string) {
  const design = Designs.get(designId, false);

  if (!design) {
    return;
  }

  DesignStudioStore.initialize(design);
}
