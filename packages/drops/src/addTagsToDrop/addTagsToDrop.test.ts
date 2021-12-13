import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Tags,
  onRun as onRunTags,
  onDisable as onDisableTags,
  Tag,
  TagNotFoundError,
} from '@minddrop/tags';
import { onRun, onDisable } from '../drops-extension';
import { addTagsToDrop } from './addTagsToDrop';
import { Drop } from '../types';
import { createDrop } from '../createDrop';

let core = initializeCore('drops');

// Run tags extension
onRunTags(core);
// Run drops extension
onRun(core);

describe('addTagsToDrop', () => {
  afterEach(() => {
    core = initializeCore('drops');
    act(() => {
      onDisableTags(core);
      onDisable(core);
      onRunTags(core);
      onRun(core);
    });
  });

  it('adds tags to the drop', async () => {
    let drop: Drop;
    let tagRef: Tag;

    await act(async () => {
      tagRef = await Tags.create(core, { label: 'Tag' });
      drop = createDrop(core, { type: 'text' });
      drop = addTagsToDrop(core, drop.id, [tagRef.id]);
    });

    expect(drop.tags).toBeDefined();
    expect(drop.tags.length).toBe(1);
    expect(drop.tags[0]).toBe(tagRef.id);
  });

  it('throws if tag attachement does not exist', async () => {
    let drop: Drop;

    await act(async () => {
      drop = createDrop(core, { type: 'text' });
    });
    expect(() => addTagsToDrop(core, drop.id, ['missing-tag-id'])).toThrowError(
      TagNotFoundError,
    );
  });

  it("dispatches a 'drops:add-tags' event", async () => {
    const callback = jest.fn();
    let drop: Drop;
    let tagRef: Tag;

    core.addEventListener('drops:add-tags', callback);

    await act(async () => {
      tagRef = await Tags.create(core, { label: 'Tag' });
      drop = createDrop(core, { type: 'text', tags: [tagRef.id] });
      drop = addTagsToDrop(core, drop.id, [tagRef.id]);
    });

    expect(callback).toHaveBeenCalledWith({
      source: 'drops',
      type: 'drops:add-tags',
      data: { drop, tags: { [tagRef.id]: tagRef } },
    });
  });
});
