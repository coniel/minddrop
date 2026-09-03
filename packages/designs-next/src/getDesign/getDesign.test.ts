import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignNotFoundError } from '../errors';
import { cardDesign_1, cleanup, setup } from '../test-utils';
import { getDesign } from './getDesign';

describe('getDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested design', () => {
    expect(getDesign(cardDesign_1.id)).toEqual(cardDesign_1);
  });

  it('throws if the design does not exist', () => {
    expect(() => getDesign('design_missing')).toThrow(DesignNotFoundError);
  });

  it('returns null if the design does not exist and throwOnNotFound is false', () => {
    expect(getDesign('design_missing', false)).toBeNull();
  });
});
