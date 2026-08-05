import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { SpacesStore } from '../SpacesStore';
import { SpacesLoadedEvent } from '../events';
import { MockFs, cleanup, setup, spaces } from '../test-utils';
import { getSpaceFilePath, getSpacesDirPath } from '../utils';
import { initializeSpaces } from './initializeSpaces';

describe('initializeSpaces', () => {
  beforeEach(() => setup({ loadSpaces: false }));

  afterEach(cleanup);

  it('creates the spaces directory if it does not exist', async () => {
    // Remove the spaces directory
    MockFs.removeFile(getSpacesDirPath());

    await initializeSpaces();

    expect(MockFs.exists(getSpacesDirPath())).toBe(true);
  });

  it('loads spaces from the spaces directory into the store', async () => {
    await initializeSpaces();

    expect(SpacesStore.getAllArray()).toEqual(spaces);
  });

  it('filters out null spaces', async () => {
    // Create an invalid space file
    MockFs.writeTextFile(getSpaceFilePath('invalid-space'), 'invalid json');

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
