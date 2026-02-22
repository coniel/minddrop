import { uuid } from '@minddrop/utils';
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
    id: uuid(),
    created: new Date(),
    lastModified: new Date(),
  };
}
