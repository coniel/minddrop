import { useCallback, useEffect, useRef, useState } from 'react';
import { Design, Designs } from '@minddrop/designs';
import {
  CloseAppSidebarEvent,
  DefaultViewName,
  Events,
  OpenAppSidebarEvent,
  OpenViewEvent,
  SetNavToolbarWidthEvent,
} from '@minddrop/events';
import {
  CanvasProvider,
  CanvasZoomToolbar,
  useFitOnNodesReady,
} from '@minddrop/ui-canvas';
import { Panel, TextInput } from '@minddrop/ui-primitives';
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
        DesignStudioStore.getState().clearHighlight();

        return;
      }

      if (event.key !== 'Delete' && event.key !== 'Backspace') {
        return;
      }

      if (!DesignStudioStore.getState().highlightedElementId) {
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
      DesignStudioStore.getState().clear();
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

    DesignStudioStore.getState().clear();
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
 * design's layout frames, and the header with the design name
 * input and zoom toolbar.
 */
const DesignStudioWorkspace: React.FC<DesignStudioWorkspaceProps> = ({
  design,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [designName, setDesignName] = useState(design.name);

  // Fit the design's layouts into view when the workspace opens
  useFitOnNodesReady(design.layouts.map((layout) => layout.id));

  // Sync the name input when the design is renamed externally
  useEffect(() => {
    setDesignName(design.name);
  }, [design.id, design.name]);

  const handleNameBlur = useCallback(() => {
    const trimmedName = designName.trim();

    if (trimmedName && trimmedName !== design.name) {
      renameDesign(trimmedName);
    } else {
      setDesignName(design.name);
    }
  }, [design, designName]);

  const handleNameKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        nameInputRef.current?.blur();
      }
    },
    [],
  );

  return (
    <div className="design-studio-workspace">
      <DesignStudioViewport>
        {design.layouts.map((layout) => (
          <LayoutFrame key={layout.id} layoutId={layout.id}>
            <LayoutRootElement />
          </LayoutFrame>
        ))}
      </DesignStudioViewport>
      <div className="design-studio-workspace-header">
        <div className="design-studio-workspace-design-name">
          <TextInput
            ref={nameInputRef}
            variant="subtle"
            size="sm"
            value={designName}
            onValueChange={setDesignName}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
          />
        </div>
        <CanvasZoomToolbar />
      </div>
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

  DesignStudioStore.getState().initialize(design);
}
