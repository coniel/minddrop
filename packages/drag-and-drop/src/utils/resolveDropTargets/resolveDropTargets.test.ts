import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDomRect } from '@minddrop/test-utils';
import { DroppablesRegistry } from '../../DroppablesRegistry';
import { DragFixtures, cleanup, setup } from '../../test-utils';
import { DroppableOptions } from '../../types';
import { resolveDropTargets } from './resolveDropTargets';

const { activeDrag_1: drag } = DragFixtures;

/**
 * Registers a drop target element under the key, nested inside the
 * given parent.
 *
 * @param key - The target's registry key.
 * @param parent - The element to nest the target in.
 * @param options - The target's droppable options.
 * @returns The target element.
 */
function registerTarget(
  key: string,
  parent: Element,
  options: Partial<DroppableOptions> = {},
): HTMLElement {
  const element = document.createElement('div');

  element.setAttribute('data-droppable-key', key);
  parent.appendChild(element);

  DroppablesRegistry.register({
    key,
    element,
    options: { current: { type: 'test', id: key, ...options } },
    notify: () => undefined,
  });

  return element;
}

/**
 * Returns the keys of the given targets.
 *
 * @param targets - The resolved drop targets.
 * @returns The targets' keys.
 */
function keysOf(targets: ReturnType<typeof resolveDropTargets>): string[] {
  return targets.map((target) => target.entry.key);
}

describe('resolveDropTargets', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('resolves the targets around the hit element, innermost first', () => {
    const outer = registerTarget('outer', document.body);
    const inner = registerTarget('inner', outer, { claim: false });

    expect(keysOf(resolveDropTargets(inner, drag, 0, 0))).toEqual([
      'inner',
      'outer',
    ]);
  });

  it('resolves through a hit element which is not a target itself', () => {
    const target = registerTarget('target', document.body);
    const content = document.createElement('span');

    target.appendChild(content);

    expect(keysOf(resolveDropTargets(content, drag, 0, 0))).toEqual(['target']);
  });

  it('passes over a target accepting none of the drag types', () => {
    const outer = registerTarget('outer', document.body);
    const inner = registerTarget('inner', outer, { accepts: ['other'] });

    expect(keysOf(resolveDropTargets(inner, drag, 0, 0))).toEqual(['outer']);
  });

  it('stops at a target claiming the drag', () => {
    const outer = registerTarget('outer', document.body);
    const inner = registerTarget('inner', outer);

    expect(keysOf(resolveDropTargets(inner, drag, 0, 0))).toEqual(['inner']);
  });

  it('stops at a target accepting and claiming the drag', () => {
    const outer = registerTarget('outer', document.body);
    const inner = registerTarget('inner', outer, { accepts: ['items'] });

    expect(keysOf(resolveDropTargets(inner, drag, 0, 0))).toEqual(['inner']);
  });

  it('walks past a target which does not claim the drag', () => {
    const outer = registerTarget('outer', document.body);
    const inner = registerTarget('inner', outer, { claim: false });

    expect(keysOf(resolveDropTargets(inner, drag, 0, 0))).toEqual([
      'inner',
      'outer',
    ]);
  });

  it('walks past an accepting target which does not claim the drag', () => {
    const outer = registerTarget('outer', document.body);
    const inner = registerTarget('inner', outer, {
      accepts: ['items'],
      claim: false,
    });

    expect(keysOf(resolveDropTargets(inner, drag, 0, 0))).toEqual([
      'inner',
      'outer',
    ]);
  });

  it('passes over a direct only target hit through a descendant', () => {
    const outer = registerTarget('outer', document.body, { directOnly: true });
    const inner = registerTarget('inner', outer);

    expect(keysOf(resolveDropTargets(inner, drag, 0, 0))).toEqual(['inner']);
    expect(keysOf(resolveDropTargets(outer, drag, 0, 0))).toEqual(['outer']);
  });

  it('passes over a target no longer registered', () => {
    const outer = registerTarget('outer', document.body);
    const inner = registerTarget('inner', outer);

    DroppablesRegistry.unregister('inner');

    expect(keysOf(resolveDropTargets(inner, drag, 0, 0))).toEqual(['outer']);
  });

  it('resolves each target position from its own bounds', () => {
    const target = registerTarget('target', document.body, {
      axis: 'vertical',
    });

    target.getBoundingClientRect = () => createDomRect(0, 0, 100, 100);

    expect(resolveDropTargets(target, drag, 0, 80)[0].position).toBe('after');
  });
});
