import { useEffect } from 'react';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
} from '@minddrop/events';
import { Panel } from '@minddrop/ui-primitives';
import { OpenDesignStudioEventData } from '../events';
import './DesignStudio.css';

export const DesignStudio: React.FC<OpenDesignStudioEventData> = ({
  variant,
}) => {
  // Close the app sidebar when the design studio is opened
  useEffect(() => {
    Events.dispatch(CloseAppSidebarEvent);

    return () => {
      Events.dispatch(OpenAppSidebarEvent);
    };
  }, []);

  return (
    <div className="design-studio">
      <Panel className="left-panel"></Panel>
      <div className="workspace">{variant}</div>
      <Panel className="right-panel"></Panel>
    </div>
  );
};
