import { describe, expect, it } from 'vitest';
import { Element, ListItemFrame } from '@minddrop/ast';
import {
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
} from '../../test-utils/editor.fixtures';
import { resolveSplitFrameRepair } from './resolveSplitFrameRepair';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

describe('resolveSplitFrameRepair', () => {
  it('leaves a document whose containers are whole', () => {
    const elements: Element[] = [
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item1] },
      { ...paragraphElement3 },
    ];

    expect(resolveSplitFrameRepair(elements)).toBeNull();
  });

  it('gives the blocks after a break a container of their own', () => {
    const elements: Element[] = [
      { ...paragraphElement1, ancestry: [item1] },
      // A block outside the item, splitting it in two
      { ...paragraphElement2 },
      { ...paragraphElement3, ancestry: [item1] },
    ];

    const repair = resolveSplitFrameRepair(elements);
    const ancestry = repair?.get(2);

    expect(repair?.size).toBe(1);
    expect(ancestry).toHaveLength(1);
    expect(ancestry?.[0].id).not.toBe(item1.id);
    expect(ancestry?.[0]).toMatchObject({ kind: 'list-item', marker: '-' });
  });
});
