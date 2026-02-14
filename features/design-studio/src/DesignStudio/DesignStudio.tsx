import { useEffect } from 'react';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
} from '@minddrop/events';
import { Panel } from '@minddrop/ui-primitives';
import { DatabaseDesignStudioProvider } from '../DatabaseDesignStudioProvider';
import { OpenDesignStudioEventData } from '../events';
import './DesignStudio.css';

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
        <Studio />
      </DatabaseDesignStudioProvider>
    );
  }

  return null;
};

const Studio: React.FC = () => {
  return (
    <div className="design-studio">
      <Panel className="left-panel"></Panel>
      <div className="workspace"></div>
      <Panel className="right-panel"></Panel>
    </div>
  );
};
