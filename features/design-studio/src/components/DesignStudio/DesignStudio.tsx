import { useCallback, useEffect, useState } from 'react';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
} from '@minddrop/events';
import { Button, Panel, Toolbar } from '@minddrop/ui-primitives';
import { useDesignStudioStore, useElement } from '../../DesignStudioStore';
import { OpenDesignStudioEventData } from '../../events';
import { FlatRootDesignElement } from '../../types';
import { AvailableProperties } from '../AvailableProperties';
import { ElementStyleEditor } from '../ElementStyleEditor';
import { ElementsTree } from '../ElementsTree';
import { DesignStudioRootElement } from '../design-elements/DesignStudioRootElement';
import './DesignStudio.css';

export const DesignStudio: React.FC<OpenDesignStudioEventData> = ({
  backEvent,
  backEventData,
  backButtonLabel,
  properties,
  propertyValues,
  design,
  onSave,
}) => {
  const initialize = useDesignStudioStore((state) => state.initialize);
  const storeInitialized = useDesignStudioStore((state) => state.initialized);

  // Close the app sidebar when the design studio is opened
  useEffect(() => {
    Events.dispatch(CloseAppSidebarEvent);

    return () => {
      Events.dispatch(OpenAppSidebarEvent);
    };
  }, []);

  useEffect(() => {
    initialize(design, onSave, properties, propertyValues);
  }, [properties, propertyValues, initialize, design, onSave]);

  const handleClickBack = useCallback(() => {
    if (!backEvent) {
      return;
    }

    Events.dispatch(backEvent, backEventData);
  }, [backEvent, backEventData]);

  if (!storeInitialized) {
    return null;
  }

  return (
    <div className="design-studio">
      <Panel className="left-panel">
        {properties && <AvailableProperties />}
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
        <Workspace />
      </div>
      <RightPanel />
    </div>
  );
};

const Workspace = () => {
  const element = useElement<FlatRootDesignElement>('root');

  if (!element) {
    return null;
  }

  return <DesignStudioRootElement element={element} />;
};

const RightPanel = () => {
  const [editingElement, setEditingElement] = useState<string | null>(null);

  return (
    <Panel className="right-panel">
      {editingElement ? (
        <ElementStyleEditor
          elementId={editingElement}
          onClose={() => setEditingElement(null)}
        />
      ) : (
        <ElementsTree onClickElement={setEditingElement} />
      )}
    </Panel>
  );
};
