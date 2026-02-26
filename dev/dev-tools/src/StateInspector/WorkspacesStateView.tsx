import React from 'react';
import { Workspaces } from '@minddrop/workspaces';
import { StoreInspector } from './StoreInspector';

export function useWorkspacesStoreCounts() {
  const workspaces = Workspaces.useAll();

  return {
    workspaces: workspaces.length,
  };
}

export const WorkspacesStateView: React.FC = () => {
  const workspaces = Workspaces.useAll();

  return (
    <StoreInspector
      title="Workspaces"
      items={workspaces}
      getLabel={(workspace) => workspace.name}
      getId={(workspace) => workspace.id}
    />
  );
};
