import {
  HostileCase,
  hostileWorkspaceFiles,
} from './fixtures/hostile-workspace.fixtures';
import { MockFs } from './setup-tests';

/**
 * Writes a hostile case's workspace in its healthy state into the mock
 * file system.
 *
 * @param hostileCase - The case whose workspace to write.
 */
export function writeHostileWorkspace(hostileCase: HostileCase): void {
  // Add the files every hostile workspace has and the case's healthy
  // files.
  MockFs.addFiles([...hostileWorkspaceFiles, ...hostileCase.healthyFiles]);
}
