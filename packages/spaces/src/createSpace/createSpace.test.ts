import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { SpacesStore } from '../SpacesStore';
import { DefaultSpaceIcon } from '../constants';
import { SpaceCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { resolveSpaceFilePath } from '../utils';
import { createSpace } from './createSpace';

const newSpace = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  name: 'Untitled',
  icon: DefaultSpaceIcon,
  design: {
    id: expect.any(String),
    type: 'space',
    name: 'Untitled',
    owner: expect.any(String),
    layouts: [expect.objectContaining({ type: 'space' })],
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
    expect(space.design.name).toBe('My Space');
  });

  it('uses the provided icon', async () => {
    const space = await createSpace({ icon: 'emoji:🎬:default' });

    expect(space.icon).toBe('emoji:🎬:default');
  });

  it('seeds the design with a single empty space layout', async () => {
    const space = await createSpace();

    expect(space.design.owner).toBe(space.id);
    expect(space.design.layouts).toHaveLength(1);
    expect(space.design.layouts[0].type).toBe('space');
    expect(space.design.layouts[0].tree.children).toEqual([]);
  });

  it('registers the design as a virtual design owned by the space', async () => {
    const space = await createSpace();

    expect(Designs.Store.get(space.design.id)).toEqual(
      expect.objectContaining({
        type: 'space',
        virtual: true,
        owner: space.id,
      }),
    );
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
