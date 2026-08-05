import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { SpacesStore } from '../SpacesStore';
import { SpaceUpdatedEvent, SpaceUpdatedEventData } from '../events';
import { MockFs, cleanup, mockDate, setup, space_1 } from '../test-utils';
import { Space } from '../types';
import { getSpaceFilePath } from '../utils';
import { updateSpace } from './updateSpace';

const update = {
  name: 'Updated Space 1',
};
const updatedSpace: Space = {
  ...space_1,
  ...update,
  lastModified: mockDate,
};

describe('updateSpace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the space in the store', async () => {
    await updateSpace(space_1.id, update);

    expect(SpacesStore.get(space_1.id)).toEqual(updatedSpace);
  });

  it('writes the space config to the file system', async () => {
    await updateSpace(space_1.id, update);

    expect(MockFs.readJsonFile(getSpaceFilePath(space_1.id))).toEqual(
      updatedSpace,
    );
  });

  it('returns the updated space', async () => {
    const space = await updateSpace(space_1.id, update);

    expect(space).toEqual(updatedSpace);
  });

  it('dispatches the space updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<SpaceUpdatedEventData>(
        SpaceUpdatedEvent,
        'test-space-updated',
        (payload) => {
          expect(payload.data.original).toEqual(space_1);
          expect(payload.data.updated).toEqual(updatedSpace);
          done();
        },
      );

      updateSpace(space_1.id, update);
    }));
});
