import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignNotFoundError } from '../errors';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { getDesign } from './getDesign';

const { design_books } = DesignFixtures;

describe('getDesign', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('returns the design', () => {
    expect(getDesign(design_books.id)).toEqual(design_books);
  });

  it('throws when the design does not exist', () => {
    expect(() => getDesign('design_missing')).toThrow(DesignNotFoundError);
  });

  it('returns null when the design does not exist and throwing is disabled', () => {
    expect(getDesign('design_missing', false)).toBeNull();
  });
});
