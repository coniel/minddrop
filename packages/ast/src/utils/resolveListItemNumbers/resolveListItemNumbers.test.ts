import { describe, expect, it } from 'vitest';
import { Element, Frame, ListItemFrame } from '../../types';
import { generateElement } from '../generate-element';
import { resolveListItemNumbers } from './resolveListItemNumbers';

function generateListItemFrame(
  id: string,
  data: Partial<ListItemFrame> = {},
): ListItemFrame {
  return {
    id,
    kind: 'list-item',
    ordered: true,
    marker: '.',
    ...data,
  };
}

function generateParagraph(ancestry?: Frame[]): Element {
  return generateElement('paragraph', { ancestry });
}

describe('resolveListItemNumbers', () => {
  it('numbers a run of adjacent items sequentially', () => {
    const elements = [
      generateParagraph([generateListItemFrame('item-1')]),
      generateParagraph([generateListItemFrame('item-2')]),
      generateParagraph([generateListItemFrame('item-3')]),
    ];

    expect(resolveListItemNumbers(elements)).toEqual(
      new Map([
        ['item-1', 1],
        ['item-2', 2],
        ['item-3', 3],
      ]),
    );
  });

  it('starts the run from the first item authored number', () => {
    const elements = [
      generateParagraph([generateListItemFrame('item-1', { number: 5 })]),
      generateParagraph([generateListItemFrame('item-2')]),
    ];

    expect(resolveListItemNumbers(elements)).toEqual(
      new Map([
        ['item-1', 5],
        ['item-2', 6],
      ]),
    );
  });

  it('ignores unordered items', () => {
    const elements = [
      generateParagraph([generateListItemFrame('item-1', { ordered: false })]),
    ];

    expect(resolveListItemNumbers(elements)).toEqual(new Map());
  });

  it('does not advance the run on an item continuation block', () => {
    const item = generateListItemFrame('item-1');

    // Both blocks sit in the same item, so it takes a single number
    const elements = [
      generateParagraph([item]),
      generateParagraph([item]),
      generateParagraph([generateListItemFrame('item-2')]),
    ];

    expect(resolveListItemNumbers(elements)).toEqual(
      new Map([
        ['item-1', 1],
        ['item-2', 2],
      ]),
    );
  });

  it('restarts the run when the marker changes', () => {
    const elements = [
      generateParagraph([generateListItemFrame('item-1')]),
      generateParagraph([generateListItemFrame('item-2', { marker: ')' })]),
    ];

    // The marker change starts a new list, so numbering restarts
    expect(resolveListItemNumbers(elements)).toEqual(
      new Map([
        ['item-1', 1],
        ['item-2', 1],
      ]),
    );
  });

  it('restarts the run when a root level block interrupts the list', () => {
    const elements = [
      generateParagraph([generateListItemFrame('item-1')]),
      generateParagraph(),
      generateParagraph([generateListItemFrame('item-2')]),
    ];

    expect(resolveListItemNumbers(elements)).toEqual(
      new Map([
        ['item-1', 1],
        ['item-2', 1],
      ]),
    );
  });

  it('numbers a nested list independently of its parent', () => {
    const parent1 = generateListItemFrame('parent-1');
    const parent2 = generateListItemFrame('parent-2');

    const elements = [
      generateParagraph([parent1]),
      generateParagraph([parent1, generateListItemFrame('nested-1')]),
      generateParagraph([parent1, generateListItemFrame('nested-2')]),
      generateParagraph([parent2]),
    ];

    expect(resolveListItemNumbers(elements)).toEqual(
      new Map([
        ['parent-1', 1],
        ['nested-1', 1],
        ['nested-2', 2],
        ['parent-2', 2],
      ]),
    );
  });

  it('restarts a nested run when its parent item changes', () => {
    const parent1 = generateListItemFrame('parent-1');
    const parent2 = generateListItemFrame('parent-2');

    const elements = [
      generateParagraph([parent1, generateListItemFrame('nested-1')]),
      generateParagraph([parent2, generateListItemFrame('nested-2')]),
    ];

    // The nested items share a marker but sit in different parents
    expect(resolveListItemNumbers(elements)).toEqual(
      new Map([
        ['parent-1', 1],
        ['nested-1', 1],
        ['parent-2', 2],
        ['nested-2', 1],
      ]),
    );
  });

  it('restarts a nested run after a block which does not reach its depth', () => {
    const parent = generateListItemFrame('parent-1');

    const elements = [
      generateParagraph([parent, generateListItemFrame('nested-1')]),
      // A continuation block of the parent item, which ends the nested run
      generateParagraph([parent]),
      generateParagraph([parent, generateListItemFrame('nested-2')]),
    ];

    expect(resolveListItemNumbers(elements)).toEqual(
      new Map([
        ['parent-1', 1],
        ['nested-1', 1],
        ['nested-2', 1],
      ]),
    );
  });
});
