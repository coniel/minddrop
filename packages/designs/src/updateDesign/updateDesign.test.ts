import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError, omitPath } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DefaultCardDesign } from '../default-designs';
import { DesignUpdatedEvent, DesignUpdatedEventData } from '../events';
import {
  MockFs,
  cleanup,
  design_card_1,
  element_text_1,
  setup,
} from '../test-utils';
import { Design } from '../types';
import { updateDesign } from './updateDesign';

const lastModified = new Date('2000-01-01T00:00:00.000Z');
const updatedTree = {
  ...design_card_1.tree,
  children: [
    {
      ...element_text_1,
      value: 'New text',
    },
  ],
};
const updatedDesign: Design = {
  ...design_card_1,
  tree: updatedTree,
  lastModified,
};

describe('updateDesign', () => {
  beforeEach(() => {
    setup();

    vi.setSystemTime(lastModified);
  });

  afterEach(cleanup);

  it('prevents updating default designs', async () => {
    await expect(() =>
      updateDesign(DefaultCardDesign.id, updatedTree),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('returns the updated design', async () => {
    const result = await updateDesign(design_card_1.id, updatedTree);

    expect(result).toEqual(updatedDesign);
  });

  it('updates the design in the store', async () => {
    const result = await updateDesign(design_card_1.id, updatedTree);

    expect(DesignsStore.get(result.id)).toEqual(updatedDesign);
  });

  it('writes the updated design to the file system', async () => {
    await updateDesign(design_card_1.id, updatedTree);

    expect(MockFs.readJsonFile<Design>(design_card_1.path)).toEqual(
      omitPath(updatedDesign),
    );
  });

  it('dispatches a design updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DesignUpdatedEventData>(
        DesignUpdatedEvent,
        'test',
        (payload) => {
          expect(payload.data.original).toEqual(design_card_1);
          expect(payload.data.updated).toEqual(updatedDesign);
          done();
        },
      );

      updateDesign(design_card_1.id, updatedTree);
    }));
});
