import React from 'react';
import { AppSidebar } from '@minddrop/app-ui';
import { IconsProvider } from '@minddrop/icons';
import { CoreProvider } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import './MindDrop.css';
import { useCurrentView } from '@minddrop/app';

export interface MindDropProps {
  /**
   * The application instance ID.
   */
  appId: string;
}

initializeI18n();

export const MindDrop: React.FC<MindDropProps> = ({ appId }) => {
  const { view, instance } = useCurrentView();

  const View = view.component;

  return (
    <CoreProvider appId={appId}>
      <IconsProvider>
        <div className="minddrop">
          <AppSidebar />
          <div className="app-content">
            {view && <View instanceId={instance ? instance.id : undefined} />}
          </div>
        </div>
      </IconsProvider>
    </CoreProvider>
  );
};
