import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup, workspacesConfig } from '../test-utils';
import { resolveWorkspacesConfigFilePath } from '../utils';
import { writeWorkspacesConfig } from './writeWorkspacesConfig';

describe('writeWorkspacesConfig', () => {
  beforeEach(() => setup({ loadWorkspacesConfig: false }));

  afterEach(cleanup);

  it('writes the workspaces config to the file system', async () => {
    writeWorkspacesConfig();

    expect(MockFs.readJsonFile(resolveWorkspacesConfigFilePath())).toEqual(
      workspacesConfig,
    );
  });
});
