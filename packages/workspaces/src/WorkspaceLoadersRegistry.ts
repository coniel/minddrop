import { createRegistry } from '@minddrop/stores';
import { WorkspaceLoader } from './types';

// Registration order determines the order in which the loaders run
// when a workspace loads.
export const WorkspaceLoadersRegistry = createRegistry<WorkspaceLoader>(
  'Workspaces:Loaders',
  'id',
  { label: 'workspace loader' },
);
