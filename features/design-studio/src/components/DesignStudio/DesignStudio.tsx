import { useCallback, useEffect } from 'react';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
} from '@minddrop/events';
import { Button, Panel, Toolbar } from '@minddrop/ui-primitives';
import { OpenDesignStudioEventData } from '../../events';
import { DesignCanvas } from '../DesignCanvas/DesignCanvas';
import { DesignStudioLeftPanel } from '../DesignStudioLeftPanel';
import './DesignStudio.css';

export const DesignStudio: React.FC<OpenDesignStudioEventData> = ({
  backEvent,
  backEventData,
  backButtonLabel,
}) => {
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
        <DesignCanvas />
      </div>
      <Panel className="right-panel" />
    </div>
  );
};
