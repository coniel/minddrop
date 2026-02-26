import { useCallback, useEffect, useRef, useState } from 'react';
import { Designs } from '@minddrop/designs';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
} from '@minddrop/events';
import { Button, Panel, TextInput, Toolbar } from '@minddrop/ui-primitives';
import { useDesignStudioStore } from '../../DesignStudioStore';
import { OpenDesignStudioEventData } from '../../events';
import { DesignCanvas } from '../DesignCanvas/DesignCanvas';
import { DesignStudioLeftPanel } from '../DesignStudioLeftPanel';
import { ElementStyleEditor } from '../ElementStyleEditor';
import { ElementsTree } from '../ElementsTree';
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

  // Close the app sidebar when the design studio is opened
  useEffect(() => {
    Events.dispatch(CloseAppSidebarEvent);

    return () => {
      Events.dispatch(OpenAppSidebarEvent);
    };
  }, []);

  const handleClickBack = useCallback(() => {
    if (!backEvent) {
      return;
    }

    Events.dispatch(backEvent, backEventData);
  }, [backEvent, backEventData]);

  return (
    <div className="design-studio">
      <Panel className="left-panel">
        <DesignStudioLeftPanel />
      </Panel>
      <div className="workspace">
        <Toolbar>
          {backEvent && (
            <Button
              variant="ghost"
              startIcon="chevron-left"
              label={backButtonLabel || 'actions.back'}
              onClick={handleClickBack}
            />
          )}
        </Toolbar>
        {design && (
          <div className="workspace-design-name">
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
        )}
        <DesignCanvas />
      </div>
      <Panel className="right-panel">
        {selectedElementId ? <ElementStyleEditor /> : <ElementsTree />}
      </Panel>
    </div>
  );
};
