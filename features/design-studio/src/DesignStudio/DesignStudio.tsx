import { useEffect, useState } from 'react';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
} from '@minddrop/events';
import { Panel } from '@minddrop/ui-primitives';
import { AvailableDatabaseProperties } from '../AvailableDatabaseProperties';
import { DatabaseDesignStudioProvider } from '../DatabaseDesignStudioProvider';
import { useDesignStudio } from '../DesignStudioProvider';
import { ElementsTree } from '../ElementsTree';
import { DesignStudioElement } from '../design-elements';
import { OpenDesignStudioEventData } from '../events';
import './DesignStudio.css';
import { DesignElement } from '@minddrop/designs';
import { ElementStyleEditor } from '../ElementStyleEditor';

export const DesignStudio: React.FC<OpenDesignStudioEventData> = ({
  variant,
  databaseId,
  designId,
}) => {
  // Close the app sidebar when the design studio is opened
  useEffect(() => {
    Events.dispatch(CloseAppSidebarEvent);

    return () => {
      Events.dispatch(OpenAppSidebarEvent);
    };
  }, []);

  if (variant === 'database' && databaseId && designId) {
    return (
      <DatabaseDesignStudioProvider databaseId={databaseId} designId={designId}>
        <Studio leftPanelContent={<AvailableDatabaseProperties />} />
      </DatabaseDesignStudioProvider>
    );
  }

  return null;
};

interface StudioProps {
  leftPanelContent?: React.ReactNode;
}

const Studio: React.FC<StudioProps> = ({ leftPanelContent }) => {
  const { tree } = useDesignStudio();
  const [editingElement, setEditingElement] = useState<DesignElement | null>(
    null,
  );

  return (
    <div className="design-studio">
      <Panel className="left-panel">{leftPanelContent}</Panel>
      <div className="workspace">
        <DesignStudioElement element={tree} />
      </div>
      <Panel className="right-panel">
        {editingElement ? (
          <ElementStyleEditor
            element={editingElement}
            onClose={() => setEditingElement(null)}
          />
        ) : (
          <ElementsTree onClickElement={setEditingElement} />
        )}
      </Panel>
    </div>
  );
};
