import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from '../extension';
import { loadTags } from './loadTags';
import { generateTag } from '../generateTag';

let core = initializeCore('tags');

// Set up extension
onRun(core);

describe('loadTags', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('tags');
    onRun(core);
  });

  it("dispatches a 'tags:load' event", () => {
    const callback = jest.fn();
    const tag1 = generateTag({ label: 'Book' });
    const tag2 = generateTag({ label: 'Link' });
    const tags = [tag1, tag2];

    core.addEventListener('tags:load', callback);

    loadTags(core, tags);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toEqual(tags);
  });
});
