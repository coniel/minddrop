import { Tags, TagNotFoundError, TAGS_TEXT_DATA } from '@minddrop/tags';
import { addTagsToDrop } from './addTagsToDrop';
import { cleanup, core, setup, textDrop1 } from '../test-utils';
import { getDrop } from '../getDrop';
import { DropNotFoundError } from '../errors';
import { mapById } from '@minddrop/utils';

const { tag1 } = TAGS_TEXT_DATA;

describe('addTagsToDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the drop does not exist', () => {
    // Attempt to add a tag to a non-existing drop.
    // Should throw a `DropNotFoundError`.
    expect(() => addTagsToDrop(core, 'missing', [tag1.id])).toThrowError(
      DropNotFoundError,
    );
  });

  it('throws if a tag does not exist', () => {
    // Attempt to add a non-existing tag to a drop.
    // Should throw a `TagNotFoundError`.
    expect(() => addTagsToDrop(core, textDrop1.id, ['missing'])).toThrowError(
      TagNotFoundError,
    );
  });

  it('adds tags to the drop', async () => {
    // Add a tag to a drop
    addTagsToDrop(core, textDrop1.id, [tag1.id]);

    // Get the updated drop
    const drop = getDrop(textDrop1.id);

    // Drop should contain the tag ID
    expect(drop.tags).toContain(tag1.id);
  });

  it('returns the updated drop', () => {
    // Add a tag to a drop
    const drop = addTagsToDrop(core, textDrop1.id, [tag1.id]);

    // Drop should contain the tag ID
    expect(drop.tags).toContain(tag1.id);
  });

  it("dispatches a 'drops:add-tags' event", (done) => {
    // Listen to 'drops:add-tags' events
    core.addEventListener('drops:add-tags', (payload) => {
      // Get the updated drop
      const drop = getDrop(textDrop1.id);
      // Get the updated tag
      const tag = Tags.get(tag1.id);

      // Payload data should contain the drop
      expect(payload.data.drop).toEqual(drop);
      // Payload data should contain the added tags
      expect(payload.data.tags).toEqual(mapById([tag]));
      done();
    });

    // Add a tag to a drop
    addTagsToDrop(core, textDrop1.id, [tag1.id]);
  });
});
