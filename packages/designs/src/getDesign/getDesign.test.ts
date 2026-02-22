import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignNotFoundError } from '../errors';
import { cleanup, design_card_1, setup } from '../test-utils';
import { getDesign } from './getDesign';

describe('getDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the design does not exist', () => {
    expect(() => getDesign('non-existent-design')).toThrow(DesignNotFoundError);
  });

  it('returns null if the design does not exist and throwOnNotFound is false', () => {
    expect(getDesign('non-existent-design', false)).toBeNull();
  });

  it('returns the design if it exists', () => {
    expect(getDesign(design_card_1.id)).toEqual(design_card_1);
  });
});
