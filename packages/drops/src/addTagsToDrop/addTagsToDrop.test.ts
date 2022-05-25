import {
  ResourceDocumentNotFoundError,
  ResourceValidationError,
} from '@minddrop/resources';
import { TAGS_TEST_DATA } from '@minddrop/tags';
import { addTagsToDrop } from './addTagsToDrop';
import { cleanup, core, setup, drop1 } from '../test-utils';
import { DropsResource } from '../DropsResource';

const { tag1 } = TAGS_TEST_DATA;

describe('addTagsToDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the drop does not exist', () => {
    // Attempt to add a tag to a non-existing drop.
    // Should throw a `DropNotFoundError`.
    expect(() => addTagsToDrop(core, 'missing', [tag1.id])).toThrowError(
      ResourceDocumentNotFoundError,
    );
  });

  it('throws if a tag does not exist', () => {
    // Attempt to add a non-existing tag to a drop.
    // Should throw a `TagNotFoundError`.
    expect(() => addTagsToDrop(core, drop1.id, ['missing'])).toThrowError(
      ResourceValidationError,
    );
  });

  it('adds tags to the drop', async () => {
    // Add a tag to a drop
    addTagsToDrop(core, drop1.id, [tag1.id]);

    // Get the updated drop
    const drop = DropsResource.get(drop1.id);

    // Drop should contain the tag ID
    expect(drop.tags).toContain(tag1.id);
  });

  it('returns the updated drop', () => {
    // Add a tag to a drop
    const drop = addTagsToDrop(core, drop1.id, [tag1.id]);

    // Drop should contain the tag ID
    expect(drop.tags).toContain(tag1.id);
  });
});
