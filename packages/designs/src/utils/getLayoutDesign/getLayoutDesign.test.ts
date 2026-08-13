import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures, cleanup, setup } from '../../test-utils';
import { getLayoutDesign } from './getLayoutDesign';

const { design_books, layout_card_1 } = DesignFixtures;

describe('getLayoutDesign', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('returns the design containing the layout', () => {
    expect(getLayoutDesign(layout_card_1.id)).toEqual(design_books);
  });

  it('returns null when no design contains the layout', () => {
    expect(getLayoutDesign('layout_missing')).toBeNull();
  });
});
