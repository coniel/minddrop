import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, markdownItemTypeConfig, setup } from '../test-utils';
import { itemTypeConfigFilePath } from '../utils';
import { writeItemTypeConfig } from './writeItemTypeConfig';

describe('writeConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('should write the item type config to the file system', async () => {
    const path = itemTypeConfigFilePath(markdownItemTypeConfig);

    // Remove the existing config file from the mock file system
    MockFs.removeFile(path);

    await writeItemTypeConfig(markdownItemTypeConfig.namePlural);

    expect(JSON.parse(MockFs.readTextFile(path))).toEqual(
      markdownItemTypeConfig,
    );
  });
});
