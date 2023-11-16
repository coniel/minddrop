import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  FileNotFoundError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { JsonParseError } from '@minddrop/utils';
import {
  setup,
  cleanup,
  workspacesConfig,
  workspcesConfigFileDescriptor,
} from '../test-utils';
import { getWorkspacesConfig } from './getWorkspacesConfig';

const MockFs = initializeMockFileSystem([
  // Workspaces cinfig file
  workspcesConfigFileDescriptor,
]);

describe('getWorkspacesConfig', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the workspaces config file does not exist', () => {
    // Pretend workspaces file does not exist
    MockFs.clear();

    // Should throw a FileNotFoundError
    expect(() => getWorkspacesConfig()).rejects.toThrowError(FileNotFoundError);
  });

  it('throws if the workspaces config file could not be parsed', () => {
    // Pretend workspaces config file contains invalid JSON
    MockFs.setFiles([
      {
        ...workspcesConfigFileDescriptor,
        textContent: 'foo',
      },
    ]);

    // Should throw a JsonParseError
    expect(() => getWorkspacesConfig()).rejects.toThrowError(JsonParseError);
  });

  it('returns parsed contents of workspaces config file', async () => {
    // Get workspaces config
    const config = await getWorkspacesConfig();

    // Should return parsed file contents
    expect(config).toEqual(workspacesConfig);
  });
});
