import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { omitPath } from '@minddrop/utils';
import { MockFs, cleanup, setup, workspace_1 } from '../test-utils';
import { getWorkspaceConfigFilePath } from '../utils';
import { writeWorkspaceConfig } from './writeWorkspaceConfig';

const configFilePath = getWorkspaceConfigFilePath(workspace_1.path);

describe('writeWorkspaceConfig', () => {
  beforeEach(() => setup({ loadWorkspaceFiles: false }));

  afterEach(cleanup);

  it('creates the hidden config directory if it does not exist', async () => {
    await writeWorkspaceConfig(workspace_1.id);

    expect(MockFs.exists(Fs.parentDirPath(configFilePath))).toBe(true);
  });

  it('writes the workspace config to the file system', async () => {
    await writeWorkspaceConfig(workspace_1.id);

    const configFileContents = MockFs.readJsonFile(configFilePath);

    expect(configFileContents).toEqual(omitPath(workspace_1));
  });
});
