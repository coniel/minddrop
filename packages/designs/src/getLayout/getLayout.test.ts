import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LayoutNotFoundError } from '../errors';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { getLayout } from './getLayout';

const { layout_card_1 } = DesignFixtures;

describe('getLayout', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('returns the layout from the design containing it', () => {
    expect(getLayout(layout_card_1.id)).toEqual(layout_card_1);
  });

  it('throws when the layout does not exist', () => {
    expect(() => getLayout('layout_missing')).toThrow(LayoutNotFoundError);
  });

  it('returns null when the layout does not exist and throwing is disabled', () => {
    expect(getLayout('layout_missing', false)).toBeNull();
  });
});
