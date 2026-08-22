import { describe, expect, it } from 'vitest';
import { BlockquoteFrame, ListItemFrame } from '@minddrop/ast';
import {
  listItemFrame1,
  paragraphElement1,
  paragraphElement2,
} from '../../test-utils/editor.fixtures';
import { IdentifiedElement } from '../../types';
import {
  resolveBlockFrames,
  resolveBlockFramesSignature,
} from './resolveBlockFrames';

const orderedItemFrame1: ListItemFrame = {
  id: 'ordered-item-1',
  kind: 'list-item',
  ordered: true,
  marker: '.',
  number: 1,
};

const orderedItemFrame2: ListItemFrame = {
  ...orderedItemFrame1,
  id: 'ordered-item-2',
};

const blockquoteFrame1: BlockquoteFrame = {
  id: 'blockquote-1',
  kind: 'blockquote',
};

// A paragraph with a block ID, which resolved frames are keyed by
const block1: IdentifiedElement = { ...paragraphElement1, id: 'block-1' };
const block2: IdentifiedElement = { ...paragraphElement2, id: 'block-2' };

describe('resolveBlockFrames', () => {
  it('leaves out blocks which have no containers', () => {
    const frames = resolveBlockFrames([
      block1,
      { ...block2, ancestry: [listItemFrame1] },
    ]);

    expect(frames.size).toBe(1);
    expect(frames.has('block-2')).toBe(true);
  });

  it('marks the blocks which open and close a container', () => {
    // Two paragraphs inside a single list item
    const frames = resolveBlockFrames([
      { ...block1, ancestry: [listItemFrame1] },
      { ...block2, ancestry: [listItemFrame1] },
    ]);

    expect(frames.get('block-1')).toEqual([
      { frame: listItemFrame1, isFirstBlock: true, isLastBlock: false },
    ]);
    expect(frames.get('block-2')).toEqual([
      { frame: listItemFrame1, isFirstBlock: false, isLastBlock: true },
    ]);
  });

  it('numbers ordered list items', () => {
    const frames = resolveBlockFrames([
      { ...block1, ancestry: [orderedItemFrame1] },
      { ...block2, ancestry: [orderedItemFrame2] },
    ]);

    expect(frames.get('block-1')?.[0].number).toBe(1);
    expect(frames.get('block-2')?.[0].number).toBe(2);
  });

  it('does not number unordered list items', () => {
    const frames = resolveBlockFrames([
      { ...block1, ancestry: [listItemFrame1] },
    ]);

    expect(frames.get('block-1')?.[0].number).toBeUndefined();
  });

  it('resolves a frame per ancestry level', () => {
    const frames = resolveBlockFrames([
      { ...block1, ancestry: [blockquoteFrame1, listItemFrame1] },
    ]);

    expect(frames.get('block-1')?.map(({ frame }) => frame)).toEqual([
      blockquoteFrame1,
      listItemFrame1,
    ]);
  });
});

describe('resolveBlockFramesSignature', () => {
  it('is unchanged by a block content edit', () => {
    const item = { ...block1, ancestry: [listItemFrame1] };

    expect(
      resolveBlockFramesSignature([
        { ...item, children: [{ text: 'Edited' }] },
      ]),
    ).toBe(resolveBlockFramesSignature([item]));
  });

  it('changes when a block gains a container', () => {
    expect(
      resolveBlockFramesSignature([{ ...block1, ancestry: [listItemFrame1] }]),
    ).not.toBe(resolveBlockFramesSignature([block1]));
  });

  it('changes when a task item is checked', () => {
    const item = { ...block1, ancestry: [listItemFrame1] };
    const checked = {
      ...block1,
      ancestry: [{ ...listItemFrame1, checked: true }],
    };

    expect(resolveBlockFramesSignature([checked])).not.toBe(
      resolveBlockFramesSignature([item]),
    );
  });

  it('changes when a block is inserted between framed blocks', () => {
    const item1 = { ...block1, ancestry: [listItemFrame1] };
    const item2 = { ...block2, ancestry: [listItemFrame1] };
    const block3: IdentifiedElement = { ...paragraphElement1, id: 'block-3' };

    expect(resolveBlockFramesSignature([item1, block3, item2])).not.toBe(
      resolveBlockFramesSignature([item1, item2]),
    );
  });
});
