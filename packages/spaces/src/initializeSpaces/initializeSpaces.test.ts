import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs';
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

  it('hydrates the spaces owned designs into the designs store', async () => {
    await initializeSpaces();

    // Each space's design should be loaded as a virtual design
    spaces.forEach((space) => {
      expect(Designs.Store.get(space.design.id)).toEqual(
        expect.objectContaining({
          id: space.design.id,
          virtual: true,
          owner: space.id,
        }),
      );
    });
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
        expect(payload).toEqual(spaces);
        done();
      });

      initializeSpaces();
    }));
});
