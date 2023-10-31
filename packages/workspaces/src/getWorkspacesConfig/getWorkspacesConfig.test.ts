import {
  FileNotFoundError,
  JsonParseError,
  registerFileSystemAdapter,
} from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import { setup, cleanup } from '../test-utils';
import { getWorkspacesConfig } from './getWorkspacesConfig';

// Does workspaces config file exist
let hasWorkspacesConfig: boolean;
// Content of workspaces config file
let workspacesConfigFileContents: string;

vi.mock('../hasWorkspacesConfig', () => {
  return {
    hasWorkspacesConfig: () => hasWorkspacesConfig,
  };
});

describe('getWorkspacesConfig', () => {
  beforeAll(() => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      readTextFile: async () => workspacesConfigFileContents,
    });
  });

  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the workspaces config file does not exist', () => {
    // Pretend workspaces file does not exist
    hasWorkspacesConfig = false;

    // Should throw a FileNotFoundError
    expect(() => getWorkspacesConfig()).rejects.toThrowError(FileNotFoundError);
  });

  it('throws if the workspaces config file could not be parsed', () => {
    // Pretend workspaces config file exists
    hasWorkspacesConfig = true;
    // Pretend workspaces config file contains invalid JSON
    workspacesConfigFileContents = 'foo';

    // Should throw a JsonParseError
    expect(() => getWorkspacesConfig()).rejects.toThrowError(JsonParseError);
  });

  it('returns parsed contents of workspaces config file', async () => {
    const fileContents = { foo: 'bar' };

    // Pretend workspaces config file exists
    hasWorkspacesConfig = true;
    // Pretend workspaces config file contains valid JSON
    workspacesConfigFileContents = JSON.stringify(fileContents);

    // Get workspaces config
    const config = await getWorkspacesConfig();

    // Should return parsed file contents
    expect(config).toEqual(fileContents);
  });
});
