import { act } from '@minddrop/test-utils';
import { Tags, Tag, TagNotFoundError } from '@minddrop/tags';
import { addTagsToDrop } from './addTagsToDrop';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { cleanup, core, setup } from '../test-utils';

describe('addTagsToDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds tags to the drop', async () => {
    let drop: Drop;
    let tag: Tag;

    await act(async () => {
      tag = await Tags.create(core, { label: 'Tag' });
      drop = createDrop(core, { type: 'text' });
      drop = addTagsToDrop(core, drop.id, [tag.id]);
    });

    expect(drop.tags).toBeDefined();
    expect(drop.tags.length).toBe(1);
    expect(drop.tags[0]).toBe(tag.id);
  });

  it('throws if tag does not exist', async () => {
    let drop: Drop;

    await act(async () => {
      drop = createDrop(core, { type: 'text' });
    });
    expect(() => addTagsToDrop(core, drop.id, ['missing-tag-id'])).toThrowError(
      TagNotFoundError,
    );
  });

  it("dispatches a 'drops:add-tags' event", (done) => {
    let drop: Drop;
    let tag: Tag;

    function callback(payload) {
      expect(payload.data.drop).toEqual(drop);
      expect(payload.data.tags).toEqual({ [tag.id]: tag });
      done();
    }

    core.addEventListener('drops:add-tags', callback);

    act(() => {
      tag = Tags.create(core, { label: 'Tag' });
      drop = createDrop(core, { type: 'text', tags: [tag.id] });
      drop = addTagsToDrop(core, drop.id, [tag.id]);
    });
  });
});
