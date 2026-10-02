import { entityId } from '@minddrop/utils';
import { WorkspaceEntityType } from '../constants';
import { Workspace } from '../types';

type GenerateWorkspaceOptions = Pick<Workspace, 'path' | 'name' | 'icon'>;

/**
 * Generates a workspace config object.
 *
 * @param options - The workspace config options.
 * @returns The generated workspace config.
 */
export function generateWorkspaceConfig(
  options: GenerateWorkspaceOptions,
): Workspace {
  return {
    ...options,
    id: entityId(WorkspaceEntityType),
    created: new Date(),
    lastModified: new Date(),
  };
}
