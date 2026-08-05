import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { SpacesStore } from '../SpacesStore';
import { SpaceDeletedEvent } from '../events';
import { MockFs, cleanup, setup, space_1 } from '../test-utils';
import { getSpaceFilePath } from '../utils';
import { deleteSpace } from './deleteSpace';

describe('deleteSpace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the space from the store', async () => {
    await deleteSpace(space_1.id);

    expect(SpacesStore.get(space_1.id)).toBeNull();
  });

  it('deletes the space config from the file system', async () => {
    await deleteSpace(space_1.id);

    expect(MockFs.exists(getSpaceFilePath(space_1.id))).toBe(false);
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
