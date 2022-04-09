import { TagsStore } from '../TagsStore';
import { cleanup, core, setup } from '../test-utils';
import { createTag } from './createTag';

describe('createTag', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the new tag', () => {
    // Create a tag
    const tag = createTag(core, { label: 'Book', color: 'red' });

    // Tag should have an ID
    expect(typeof tag.id).toBe('string');
    // Tag should have the given label
    expect(tag.label).toBe('Book');
    // Tag should have the given color
    expect(tag.color).toBe('red');
  });

  it('adds tag to the tags store', () => {
    // Create a tag
    const tag = createTag(core, { label: 'Book', color: 'red' });

    // Tags should be in the tags store
    expect(TagsStore.get(tag.id)).toEqual(tag);
  });

  it("dispatches a 'tags:create' event", (done) => {
    // Listen to 'tags:create' events
    core.addEventListener('tags:create', (payload) => {
      // Get the created tag
      const tag = TagsStore.get(payload.data.id);

      // Payload data should be the created tag
      expect(payload.data).toEqual(tag);
      done();
    });

    // Create a tag
    createTag(core, { label: 'Book', color: 'red' });
  });
});
