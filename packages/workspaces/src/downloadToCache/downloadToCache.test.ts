import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  setup,
  cleanup,
  workspace1,
  workspace1ConfigPath,
  workspcesConfigFileDescriptor,
} from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceCacheDirName, WorkspaceConfigDirName } from '../constants';
import { downloadToCache } from './downloadToCache';

const CAHCE_DIR_PATH = `${workspace1.path}/${WorkspaceConfigDirName}/${WorkspaceCacheDirName}`;
const RESOURCE_DIR_PATH = `${CAHCE_DIR_PATH}/resource-id`;

const MockFs = initializeMockFileSystem([
  // Workspaces config file
  workspcesConfigFileDescriptor,
  // Workspace 1 config file
  workspace1ConfigPath,
]);

describe('downloadToCache', () => {
  beforeEach(() => {
    setup();

    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('creates the cache directory if it does not exist', async () => {
    await downloadToCache(
      workspace1.path,
      'resource-id',
      'file.txt',
      'http://example.com/file.txt',
    );

    expect(MockFs.exists(CAHCE_DIR_PATH)).toBeTruthy();
  });

  it('creates the resource directory if it does not exist', async () => {
    await downloadToCache(
      workspace1.path,
      'resource-id',
      'file.txt',
      'http://example.com/file.txt',
    );

    expect(MockFs.exists(RESOURCE_DIR_PATH)).toBeTruthy();
  });

  it('downloads the file to the cache directory', async () => {
    await downloadToCache(
      workspace1.path,
      'resource-id',
      'file.txt',
      'http://example.com/file.txt',
    );

    expect(MockFs.exists(`${RESOURCE_DIR_PATH}/file.txt`)).toBeTruthy();
  });

  it('returns the path to the downloaded file', async () => {
    const filePath = await downloadToCache(
      workspace1.path,
      'resource-id',
      'file.txt',
      'http://example.com/file.txt',
    );

    expect(filePath).toBe(`${RESOURCE_DIR_PATH}/file.txt`);
  });
});
