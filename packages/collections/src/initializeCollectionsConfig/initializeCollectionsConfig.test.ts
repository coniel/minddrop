import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  CollectionsConfigDir,
  CollectionsConfigFileName,
  InitialCollectionsConfig,
} from '../constants';
import { cleanup, collectionsConfig, setup } from '../test-utils';
import { initializeCollectionsConfig } from './initializeCollectionsConfig';

const MockFs = initializeMockFileSystem([CollectionsConfigDir]);

describe('initializeCollectionsConfig', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('does nothing if a valid config file exists', async () => {
    MockFs.writeTextFile(
      CollectionsConfigFileName,
      JSON.stringify(collectionsConfig),
      {
        baseDir: CollectionsConfigDir,
      },
    );

    await initializeCollectionsConfig();

    expect(
      MockFs.readTextFile(CollectionsConfigFileName, {
        baseDir: CollectionsConfigDir,
      }),
    ).toBe(JSON.stringify(collectionsConfig));
  });

  it('writes the config file if it does not exist', async () => {
    await initializeCollectionsConfig();

    expect(
      MockFs.readTextFile(CollectionsConfigFileName, {
        baseDir: CollectionsConfigDir,
      }),
    ).toBe(JSON.stringify(InitialCollectionsConfig));
  });

  it('writes the config file if the existing one is invalid', async () => {
    MockFs.writeTextFile(CollectionsConfigFileName, 'invalid json', {
      baseDir: CollectionsConfigDir,
    });

    await initializeCollectionsConfig();

    expect(
      MockFs.readTextFile(CollectionsConfigFileName, {
        baseDir: CollectionsConfigDir,
      }),
    ).toBe(JSON.stringify(InitialCollectionsConfig));
  });
});
