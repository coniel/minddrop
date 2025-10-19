import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidPathError } from '@minddrop/file-system';
import { InstanceConfigFilePath } from '../constants';
import { ItemTypeInstanceNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  dataConfigDir,
  dataItemTypeInstance,
  dataItemsDir,
  dataPropertiesPath,
  setup,
} from '../test-utils';
import { writeItemTypeInstance } from './writeItemTypeInstance';

describe('writeItemTypeInstance', () => {
  beforeEach(() => {
    setup({ loadItemTypeInstances: true });
  });

  afterEach(cleanup);

  it('throws if the item type instance does not exist', () => {
    // Attempt to write a missing instance.
    // Should throw a ItemTypeInstanceNotFoundError.
    expect(() =>
      writeItemTypeInstance('missing-instance'),
    ).rejects.toThrowError(ItemTypeInstanceNotFoundError);
  });

  it('throws if the instance dir does not exist', () => {
    // Remove instance directory
    MockFs.removeFile(dataItemsDir);

    // Attempt to write the config file of a collection with a missing dir.
    // Should throw a InvalidPathError.
    expect(() =>
      writeItemTypeInstance(dataItemTypeInstance.id),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('creates the data item instance config dir if it does not exist', async () => {
    // Pretend instance config dir does not exist
    MockFs.removeDir(dataPropertiesPath);

    await writeItemTypeInstance(dataItemTypeInstance.id);

    // Should create the config dir inside the instance dir
    expect(MockFs.exists(dataConfigDir)).toBe(true);
  });

  it('writes values to the config file', async () => {
    await writeItemTypeInstance(dataItemTypeInstance.id);

    // Instance without path property
    const { path: p, ...dataItemTypeInstanceWithoutPath } =
      dataItemTypeInstance;

    // Should write config values to config file
    expect(
      MockFs.readTextFile(`${dataItemsDir}/${InstanceConfigFilePath}`),
    ).toBe(JSON.stringify(dataItemTypeInstanceWithoutPath));
  });
});
