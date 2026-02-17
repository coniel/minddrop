import { useEffect, useState } from 'react';
import { Databases } from '@minddrop/databases';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
} from '@minddrop/events';
import { Panel } from '@minddrop/ui-primitives';
import { useDesignStudioStore } from '../../DesignStudioStore';
import { OpenDesignStudioEventData } from '../../events';
import { AvailableDatabaseProperties } from '../AvailableDatabaseProperties';
import { ElementStyleEditor } from '../ElementStyleEditor';
import { ElementsTree } from '../ElementsTree';
import { DesignStudioElement } from '../design-elements';
import './DesignStudio.css';

export const DesignStudio: React.FC<OpenDesignStudioEventData> = ({
  variant,
  databaseId,
  designId,
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
    if (variant === 'database' && databaseId && designId) {
      const database = Databases.get(databaseId);
      const design = Databases.getDesign(databaseId, designId);

      if (!design) {
        return;
      }

      initialize(design.tree, database.properties);
    }
  }, [variant, databaseId, designId, initialize]);

  if (!storeInitialized) {
    return null;
  }

  if (variant === 'database') {
    return <Studio leftPanelContent={<AvailableDatabaseProperties />} />;
  }

  return <Studio />;
};

interface StudioProps {
  leftPanelContent?: React.ReactNode;
}

const Studio: React.FC<StudioProps> = ({ leftPanelContent }) => {
  return (
    <div className="design-studio">
      <Panel className="left-panel">{leftPanelContent}</Panel>
      <div className="workspace">
        <Workspace />
      </div>
      <RightPanel />
    </div>
  );
};

const Workspace = () => {
  return <DesignStudioElement index={0} elementId="root" />;
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
