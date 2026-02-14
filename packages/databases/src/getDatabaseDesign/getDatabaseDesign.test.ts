import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { getDatabaseDesign } from './getDatabaseDesign';

describe('getDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the specified design', () => {
    const design = getDatabaseDesign(
      objectDatabase.id,
      objectDatabase.designs[0].id,
    );

    expect(design).toEqual(objectDatabase.designs[0]);
  });

  it('returns null if the design does not exist', () => {
    const design = getDatabaseDesign(objectDatabase.id, 'non-existent-design');

    expect(design).toBeNull();
  });
});
