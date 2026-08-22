import { describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { flattenTree } from '../flattenTree';
import { reconstructTree } from './reconstructTree';

const { layout_card_1 } = DesignFixtures;

describe('reconstructTree', () => {
  it('round-trips a flattened tree back to the original', () => {
    const elements = flattenTree(layout_card_1.tree);

    expect(reconstructTree(elements)).toEqual(layout_card_1.tree);
  });

  it('does not mutate the element map', () => {
    const elements = flattenTree(layout_card_1.tree);
    const snapshot = JSON.parse(JSON.stringify(elements));

    reconstructTree(elements);

    // The flat elements keep their parent/children ID fields
    expect(elements).toEqual(snapshot);
  });
});
