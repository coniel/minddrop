import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { SpacesStore } from '../SpacesStore';
import { SpacesLoadedEvent } from '../events';
import { MockFs, cleanup, setup, spaces } from '../test-utils';
import { resolveSpaceFilePath, resolveSpacesDirPath } from '../utils';
import { initializeSpaces } from './initializeSpaces';

describe('initializeSpaces', () => {
  beforeEach(() => setup({ loadSpaces: false }));

  afterEach(cleanup);

  it('creates the spaces directory if it does not exist', async () => {
    // Remove the spaces directory
    MockFs.removeFile(resolveSpacesDirPath());

    await initializeSpaces();

    expect(MockFs.exists(resolveSpacesDirPath())).toBe(true);
  });

  it('loads spaces from the spaces directory into the store', async () => {
    await initializeSpaces();

    expect(SpacesStore.getAllArray()).toEqual(spaces);
  });

  it('filters out null spaces', async () => {
    // Create an invalid space file
    MockFs.addFiles([
      {
        path: resolveSpaceFilePath('invalid-space'),
        textContent: 'invalid json',
      },
    ]);

    await initializeSpaces();

    expect(SpacesStore.getAllArray()).toEqual(spaces);
  });

  it('dispatches a spaces loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(SpacesLoadedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(spaces);
        done();
      });

      initializeSpaces();
    }));
});
