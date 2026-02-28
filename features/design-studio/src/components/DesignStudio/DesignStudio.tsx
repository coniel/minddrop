import { useCallback, useEffect, useRef, useState } from 'react';
import { Designs } from '@minddrop/designs';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
} from '@minddrop/events';
import { Panel, TextInput } from '@minddrop/ui-primitives';
import { DesignStudioStore, saveDesign, useDesignStudioStore } from '../../DesignStudioStore';
import { OpenDesignStudioEventData } from '../../events';
import { DesignCanvas } from '../DesignCanvas/DesignCanvas';
import { DesignStudioLeftPanel } from '../DesignStudioLeftPanel';
import { ElementStyleEditor } from '../ElementStyleEditor';
import './DesignStudio.css';

export const DesignStudio: React.FC<OpenDesignStudioEventData> = ({
  backEvent,
  backEventData,
  backButtonLabel,
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
      Designs.update(design.id, { name: trimmedName });
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

  // Clear the canvas highlight when clicking the workspace background
  const handleWorkspaceClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        DesignStudioStore.getState().clearHighlight();
      }
    },
    [],
  );

  const handleClickBack = useCallback(() => {
    if (!backEvent) {
      return;
    }

    Events.dispatch(backEvent, backEventData);
  }, [backEvent, backEventData]);

  return (
    <div className="design-studio">
      <Panel className="design-studio-left-panel">
        <DesignStudioLeftPanel
          onClickBack={backEvent ? handleClickBack : undefined}
        />
      </Panel>
      <div className="design-studio-workspace">
        {design && (
          <>
            <div className="design-studio-workspace-design-name">
              <TextInput
                ref={nameInputRef}
                variant="ghost"
                textSize="lg"
                weight="semibold"
                value={designName}
                onValueChange={setDesignName}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
              />
            </div>
            <div
              className="design-studio-workspace-canvas-area"
              onClick={handleWorkspaceClick}
            >
              <DesignCanvas />
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
