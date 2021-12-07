import { initializeCore } from '@minddrop/core';
import { createTag } from './createTag';

let core = initializeCore('tags');

describe('createTag', () => {
  afterEach(() => {
    core = initializeCore('tags');
  });

  it('creates a tag', () => {
    const tag = createTag(core, { label: 'Book', color: 'red' });

    expect(tag).toBeDefined();
    expect(tag.label).toBe('Book');
    expect(tag.color).toBe('red');
  });

  it("dispatches a 'tags:create' event", () => {
    const callback = jest.fn();

    core.addEventListener('tags:create', callback);

    const tag = createTag(core, { label: 'My tag' });

    expect(callback).toHaveBeenCalledWith({
      source: 'tags',
      type: 'tags:create',
      data: tag,
    });
  });
});
