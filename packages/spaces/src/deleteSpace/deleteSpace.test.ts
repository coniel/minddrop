import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { SpacesStore } from '../SpacesStore';
import { SpaceDeletedEvent } from '../events';
import { MockFs, cleanup, setup, space_1 } from '../test-utils';
import { resolveSpaceBundleDirPath, resolveSpaceMediaDirPath } from '../utils';
import { deleteSpace } from './deleteSpace';

describe('deleteSpace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the space from the store', async () => {
    await deleteSpace(space_1.id);

    expect(SpacesStore.get(space_1.id)).toBeNull();
  });

  it('removes the space owned design from the designs store', async () => {
    await deleteSpace(space_1.id);

    expect(Designs.Store.get(space_1.design.id)).toBeNull();
  });

  it('deletes the space bundle directory from the file system', async () => {
    await deleteSpace(space_1.id);

    expect(MockFs.exists(resolveSpaceBundleDirPath(space_1.id))).toBe(false);
  });

  it('deletes the space media along with the bundle', async () => {
    const mediaPath = `${resolveSpaceMediaDirPath(space_1.id)}/image.png`;

    MockFs.addFiles([{ path: mediaPath, textContent: 'image data' }]);

    await deleteSpace(space_1.id);

    expect(MockFs.exists(mediaPath)).toBe(false);
  });

  it('dispatches the space deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(SpaceDeletedEvent, 'test-space-deleted', (payload) => {
        expect(payload.data).toEqual(space_1);
        done();
      });

      deleteSpace(space_1.id);
    }));
});
