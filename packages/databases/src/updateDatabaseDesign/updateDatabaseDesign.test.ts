import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { InvalidParameterError } from '@minddrop/utils';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { updateDatabaseDesign } from './updateDatabaseDesign';

const { cardDesign1 } = DesignFixtures;

const updatedDesign = {
  ...cardDesign1,
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
        type: 'list',
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('should update the design in the database', async () => {
    // Database contains design1, udpate it
    const result = await updateDatabaseDesign(objectDatabase.id, updatedDesign);

    expect(result.designs.find((d) => d.id === cardDesign1.id)).toEqual(
      updatedDesign,
    );
  });
});
