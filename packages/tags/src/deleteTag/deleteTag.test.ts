import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../tags-extension';
import { createTag } from '../createTag';
import { Tag } from '../types';
import { deleteTag } from './deleteTag';

let core = initializeCore('tags');

// Set up extension
onRun(core);

describe('deleteTag', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('tags');
    onRun(core);
  });

  it("dispatches a 'tags:delete' event", () => {
    const callback = jest.fn();
    let tag: Tag;

    core.addEventListener('tags:delete', callback);

    act(() => {
      tag = createTag(core, { label: 'Book' });
    });

    deleteTag(core, tag.id);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toBe(tag);
  });
});
