import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LayoutNotFoundError } from '../errors';
import { cleanup, layout_card_1, setup } from '../test-utils';
import { getLayout } from './getLayout';

describe('getLayout', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the layout does not exist', () => {
    expect(() => getLayout('non-existent-layout')).toThrow(LayoutNotFoundError);
  });

  it('returns null if the layout does not exist and throwOnNotFound is false', () => {
    expect(getLayout('non-existent-layout', false)).toBeNull();
  });

  it('returns the layout if it exists', () => {
    expect(getLayout(layout_card_1.id)).toEqual(layout_card_1);
  });
});
