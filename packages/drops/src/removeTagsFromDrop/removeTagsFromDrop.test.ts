import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Tags,
  onRun as onRunTags,
  onDisable as onDisableTags,
  Tag,
} from '@minddrop/tags';
import { onRun, onDisable } from '../drops-extension';
import { removeTagsFromDrop } from './removeTagsFromDrop';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { addTagsToDrop } from '../addTagsToDrop';

let core = initializeCore('drops');

// Run tags extension
onRunTags(core);
// Run drops extension
onRun(core);

describe('removeTagsFromDrop', () => {
  afterEach(() => {
    core = initializeCore('drops');
    act(() => {
      onDisableTags(core);
      onDisable(core);
      onRunTags(core);
      onRun(core);
    });
  });

  it('removes tags from the drop', async () => {
    let drop: Drop;
    let tagRef1: Tag;
    let tagRef2: Tag;

    await act(async () => {
      tagRef1 = await Tags.create(core, { label: 'Tag' });
      tagRef2 = await Tags.create(core, { label: 'Tag' });
      drop = createDrop(core, { type: 'text' });
      drop = addTagsToDrop(core, drop.id, [tagRef1.id, tagRef2.id]);
      drop = removeTagsFromDrop(core, drop.id, [tagRef1.id]);
    });

    expect(drop.tags).toBeDefined();
    expect(drop.tags.length).toBe(1);
    expect(drop.tags[0]).toBe(tagRef2.id);
  });

  it('removes the tags field if there are no tags left', async () => {
    let drop: Drop;
    let tagRef: Tag;

    await act(async () => {
      tagRef = await Tags.create(core, { label: 'Tag' });
      drop = createDrop(core, { type: 'text' });
      drop = addTagsToDrop(core, drop.id, [tagRef.id]);
      drop = removeTagsFromDrop(core, drop.id, [tagRef.id]);
    });

    expect(drop.tags).not.toBeDefined();
  });

  it("dispatches a 'drops:remove-tags' event", async () => {
    const callback = jest.fn();
    let drop: Drop;
    let tagRef: Tag;

    core.addEventListener('drops:remove-tags', callback);

    await act(async () => {
      tagRef = await Tags.create(core, { label: 'Tag' });
      drop = createDrop(core, { type: 'text', tags: [tagRef.id] });
      drop = addTagsToDrop(core, drop.id, [tagRef.id]);
      drop = removeTagsFromDrop(core, drop.id, [tagRef.id]);
    });

    expect(callback).toHaveBeenCalledWith({
      source: 'drops',
      type: 'drops:remove-tags',
      data: { drop, tags: { [tagRef.id]: tagRef } },
    });
  });
});
