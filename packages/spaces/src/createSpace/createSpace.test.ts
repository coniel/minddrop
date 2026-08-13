import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DefaultPageLayout } from '@minddrop/designs-legacy';
import { Events } from '@minddrop/events';
import { SpacesStore } from '../SpacesStore';
import { DefaultSpaceIcon } from '../constants';
import { SpaceCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup, spaceLayout_1 } from '../test-utils';
import { resolveSpaceFilePath } from '../utils';
import { createSpace } from './createSpace';

const newSpace = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  name: 'Untitled',
  icon: DefaultSpaceIcon,
  layout: {
    ...DefaultPageLayout,
    id: expect.any(String),
    name: 'Page',
    created: mockDate,
    lastModified: mockDate,
  },
};

describe('createSpace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a space', async () => {
    const space = await createSpace();

    expect(space).toEqual(newSpace);
  });

  it('uses the provided name', async () => {
    const space = await createSpace({ name: 'My Space' });

    expect(space.name).toBe('My Space');
  });

  it('uses the provided icon', async () => {
    const space = await createSpace({ icon: 'emoji:🎬:default' });

    expect(space.icon).toBe('emoji:🎬:default');
  });

  it('copies the provided layout with a fresh ID', async () => {
    const space = await createSpace({ layout: spaceLayout_1 });

    expect(space.layout).toEqual({
      ...spaceLayout_1,
      id: expect.any(String),
      created: mockDate,
      lastModified: mockDate,
    });
    expect(space.layout.id).not.toBe(spaceLayout_1.id);
  });

  it('adds the space to the store', async () => {
    const space = await createSpace();

    expect(SpacesStore.get(space.id)).toEqual(newSpace);
  });

  it('writes the space config to the file system', async () => {
    const space = await createSpace();

    expect(MockFs.readJsonFile(resolveSpaceFilePath(space.id))).toEqual(
      newSpace,
    );
  });

  it('dispatches the space created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(SpaceCreatedEvent, 'test-space-created', (payload) => {
        expect(payload.data).toEqual(newSpace);
        done();
      });

      createSpace();
    }));
});
