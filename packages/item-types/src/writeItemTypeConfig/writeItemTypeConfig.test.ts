import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BaseDirectory } from '@minddrop/file-system';
import { ItemTypeConfigsDir } from '../constants';
import { MockFs, cleanup, markdownItemTypeConfig, setup } from '../test-utils';
import { writeItemTypeConfig } from './writeItemTypeConfig';

describe('writeConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('should write the item type config to the file system', async () => {
    const path = `${ItemTypeConfigsDir}/${markdownItemTypeConfig.type}.json`;

    // Remove the existing config file from the mock file system
    MockFs.removeFile(path, { baseDir: BaseDirectory.WorkspaceConfig });

    await writeItemTypeConfig(markdownItemTypeConfig.type);

    expect(
      JSON.parse(
        MockFs.readTextFile(path, { baseDir: BaseDirectory.WorkspaceConfig }),
      ),
    ).toEqual(markdownItemTypeConfig);
  });
});
