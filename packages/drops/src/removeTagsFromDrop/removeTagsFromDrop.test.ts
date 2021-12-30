import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { Tags, Tag } from '@minddrop/tags';
import { removeTagsFromDrop } from './removeTagsFromDrop';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { addTagsToDrop } from '../addTagsToDrop';
import { clearDrops } from '../clearDrops';

let core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

describe('removeTagsFromDrop', () => {
  afterEach(() => {
    core = initializeCore({ appId: 'app-id', extensionId: 'drops' });
    act(() => {
      Tags.clear(core);
      clearDrops(core);
    });
  });

  it('removes tags from the drop', async () => {
    let drop: Drop;
    let tag1: Tag;
    let tag2: Tag;

    await act(async () => {
      tag1 = await Tags.create(core, { label: 'Tag' });
      tag2 = await Tags.create(core, { label: 'Tag' });
      drop = createDrop(core, { type: 'text' });
      drop = addTagsToDrop(core, drop.id, [tag1.id, tag2.id]);
      drop = removeTagsFromDrop(core, drop.id, [tag1.id]);
    });

    expect(drop.tags).toBeDefined();
    expect(drop.tags.length).toBe(1);
    expect(drop.tags[0]).toBe(tag2.id);
  });

  it("dispatches a 'drops:remove-tags' event", (done) => {
    let drop: Drop;
    let tag: Tag;

    function callback(payload) {
      expect(payload.data).toEqual({ drop, tags: { [tag.id]: tag } });
      done();
    }

    core.addEventListener('drops:remove-tags', callback);

    act(() => {
      tag = Tags.create(core, { label: 'Tag' });
      drop = createDrop(core, { type: 'text', tags: [tag.id] });
      drop = addTagsToDrop(core, drop.id, [tag.id]);
      drop = removeTagsFromDrop(core, drop.id, [tag.id]);
    });
  });
});
