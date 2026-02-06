import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DESIGN_FIXTURES } from '@minddrop/designs';
import { InvalidParameterError } from '@minddrop/utils';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { updateDatabaseDesign } from './updateDatabaseDesign';

const { design1 } = DESIGN_FIXTURES;

const updatedDesign = {
  ...design1,
  name: 'Updated Design',
};

describe('updateDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the design does not exist', async () => {
    await expect(
      updateDatabaseDesign(objectDatabase.id, {
        ...updatedDesign,
        id: 'non-existent-design',
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the design type is changed', async () => {
    await expect(
      updateDatabaseDesign(objectDatabase.id, {
        ...updatedDesign,
        type: 'new-type',
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('should update the design in the database', async () => {
    // Database contains design1, udpate it
    const result = await updateDatabaseDesign(objectDatabase.id, updatedDesign);

    expect(result.designs).toEqual([updatedDesign]);
  });
});
