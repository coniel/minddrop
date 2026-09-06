import { describe, expect, it } from 'vitest';
import { cardDesign_1, ownedCardDesign_1 } from '../test-utils';
import { serializeDesign } from './serializeDesign';

describe('serializeDesign', () => {
  it('strips the owner', () => {
    const storedDesign = serializeDesign({
      ...ownedCardDesign_1,
      owner: 'database_1',
    });

    expect(storedDesign).not.toHaveProperty('owner');
    expect(storedDesign.id).toBe(ownedCardDesign_1.id);
  });

  it('leaves ownerless designs otherwise unchanged', () => {
    expect(serializeDesign(cardDesign_1)).toEqual(cardDesign_1);
  });
});
