import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CloseAppSidebarEvent,
  DefaultMainContentViewName,
  Events,
  OpenAppSidebarEvent,
  OpenMainContentViewEvent,
} from '@minddrop/events';
import { Panel, TextInput } from '@minddrop/ui-primitives';
import { DesignStudioLeftPanel } from '../DesignStudioLeftPanel';
import { DesignStudioRootElement } from '../DesignStudioRootElement';
import {
  DesignStudioStore,
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
      const { highlightedElementId } = store;

      // Can't delete root or nothing
      if (!highlightedElementId || highlightedElementId === 'root') {
        return;
      }

      event.preventDefault();
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

  return (
    <div className="design-studio">
      <Panel className="design-studio-left-panel">
        <DesignStudioLeftPanel
          onClickBack={handleClickBack}
          newLayoutType={newLayoutType}
        />
      </Panel>
      <div className="design-studio-workspace">
        {design && (
          <>
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
          </>
        )}
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
