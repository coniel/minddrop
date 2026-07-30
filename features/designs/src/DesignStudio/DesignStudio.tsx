import { useCallback, useEffect, useRef, useState } from 'react';
import { Designs, LayoutType } from '@minddrop/designs';
import {
  CloseAppSidebarEvent,
  DefaultMainContentViewName,
  Events,
  OpenAppSidebarEvent,
  OpenMainContentViewEvent,
} from '@minddrop/events';
import { Panel, TextInput } from '@minddrop/ui-primitives';
import { DesignDashboard } from '../DesignDashboard';
import { DesignStudioLeftPanel } from '../DesignStudioLeftPanel';
import { DesignStudioRootElement } from '../DesignStudioRootElement';
import {
  DesignStudioStore,
  addLayout,
  removeLayout,
  renameDesign,
  saveDesign,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { DesignStudioToolbar } from '../DesignStudioToolbar';
import { DesignStudioViewport } from '../DesignStudioViewport';
import { ElementStyleEditor } from '../ElementStyleEditor';
import { LayoutFrame } from '../LayoutFrame/LayoutFrame';
import { OpenDesignStudioEventData } from '../events';
import { FlatRootDesignElement } from '../types';
import { centerViewOnLayout } from '../viewportActions';
import './DesignStudio.css';

export const DesignStudio: React.FC<OpenDesignStudioEventData> = ({
  backEvent,
  backEventData,
  backButtonLabel,
  newLayoutType,
}) => {
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );
  const design = useDesignStudioStore((state) => state.design);
  const [designName, setDesignName] = useState(design?.name || '');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const hasCreatedNewDesign = useRef(false);

  useEffect(() => {
    setDesignName(design?.name || '');
  }, [design?.id, design?.name]);

  const handleNameBlur = useCallback(() => {
    if (!design) {
      return;
    }

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

  // Create and open a new design with a starter layout on mount
  // when newLayoutType is set
  useEffect(() => {
    if (!newLayoutType || hasCreatedNewDesign.current) {
      return;
    }

    hasCreatedNewDesign.current = true;

    createDesignWithLayout(newLayoutType);
  }, [newLayoutType]);

  // Delete the highlighted element on Delete/Backspace
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') {
        return;
      }

      // Don't delete when typing in an input
      const tag = (event.target as HTMLElement).tagName;

      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
      }

      const store = DesignStudioStore.getState();
      const { highlightedElementId, activeLayoutId } = store;

      if (!highlightedElementId) {
        return;
      }

      event.preventDefault();

      // Deleting a frame's root deletes the entire layout
      if (highlightedElementId === 'root') {
        if (activeLayoutId) {
          removeLayout(activeLayoutId);
        }

        return;
      }

      store.removeElement(highlightedElementId);
      store.selectElement(null);
      saveDesign();
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
      Events.dispatch(OpenMainContentViewEvent, {
        view: DefaultMainContentViewName,
        component: () => null,
      });
    }
  }, [backEvent, backEventData]);

  // Return to the dashboard by closing the open design
  const handleCloseDesign = useCallback(() => {
    DesignStudioStore.getState().clear();
  }, []);

  // No design open: show the dashboard
  if (!design) {
    return <DesignDashboard onClickBack={handleClickBack} />;
  }

  return (
    <div className="design-studio">
      <Panel className="design-studio-left-panel">
        <DesignStudioLeftPanel
          onClickBack={handleCloseDesign}
          newLayoutType={newLayoutType}
        />
      </Panel>
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
          <DesignStudioToolbar />
        </div>
      </div>
      <Panel className="design-studio-right-panel">
        {selectedElementId && <ElementStyleEditor />}
      </Panel>
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
 * Creates a new design with a starter layout of the given type,
 * opens it in the editor and centers the view on the layout.
 */
async function createDesignWithLayout(type: LayoutType) {
  const design = await Designs.create();

  DesignStudioStore.getState().initialize(design);

  const layout = await addLayout(design.id, type);

  centerViewOnLayout(layout.id);
}
