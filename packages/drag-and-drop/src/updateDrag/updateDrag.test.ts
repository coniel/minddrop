import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDomRect } from '@minddrop/test-utils';
import { startDrag } from '../startDrag';
import { cleanup, setup } from '../test-utils';
import { updateDrag } from './updateDrag';

/**
 * Creates an element scrolling its content horizontally, occupying
 * the given bounds.
 *
 * @param rect - The element's bounds.
 * @param scrollLeft - The element's horizontal scroll offset.
 * @returns The element.
 */
function createScrollable(rect: DOMRect, scrollLeft: number): HTMLElement {
  const element = document.createElement('div');

  element.style.overflowX = 'auto';
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(rect);
  Object.defineProperties(element, {
    scrollLeft: { value: scrollLeft, writable: true },
    scrollWidth: { value: rect.width * 4 },
    clientWidth: { value: rect.width },
  });
  document.body.appendChild(element);

  return element;
}

/**
 * Waits for the next animation frame.
 */
function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

describe('updateDrag', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it("scrolls the source's scroll container once the pointer overshoots it", async () => {
    const scrollable = createScrollable(createDomRect(0, 0, 500, 500), 100);
    const source = document.createElement('div');

    scrollable.appendChild(source);

    startDrag({
      id: 'item-1',
      type: 'item',
      data: { items: ['item-1'] },
      sourceElement: source,
      sourceRect: createDomRect(200, 200, 100, 40),
      previewElement: source,
      clientX: 250,
      clientY: 250,
    });

    // Move the pointer past the container's left edge, over the body
    document.elementFromPoint = () => document.body;
    updateDrag(-50, 250);

    await nextFrame();

    expect(scrollable.scrollLeft).toBeLessThan(100);
  });

  it('keeps scrolling a scroll container the pointer has left', async () => {
    const scrollable = createScrollable(createDomRect(0, 0, 500, 500), 100);
    const content = document.createElement('div');
    const source = document.createElement('div');

    scrollable.appendChild(content);
    document.body.appendChild(source);

    startDrag({
      id: 'item-1',
      type: 'item',
      data: { items: ['item-1'] },
      sourceElement: source,
      sourceRect: createDomRect(600, 200, 100, 40),
      previewElement: source,
      clientX: 650,
      clientY: 250,
    });

    // Move the pointer into the container, then past its left edge
    document.elementFromPoint = () => content;
    updateDrag(250, 250);
    document.elementFromPoint = () => document.body;
    updateDrag(-50, 250);

    await nextFrame();

    expect(scrollable.scrollLeft).toBeLessThan(100);
  });

  it("keeps scrolling the source's scroll container however far the pointer overshoots it", async () => {
    const scrollable = createScrollable(createDomRect(0, 0, 500, 500), 100);
    const source = document.createElement('div');

    scrollable.appendChild(source);

    startDrag({
      id: 'item-1',
      type: 'item',
      data: { items: ['item-1'] },
      sourceElement: source,
      sourceRect: createDomRect(200, 200, 100, 40),
      previewElement: source,
      clientX: 250,
      clientY: 250,
    });

    // Move the pointer far past the container's left edge
    document.elementFromPoint = () => document.body;
    updateDrag(-2000, 250);

    await nextFrame();

    expect(scrollable.scrollLeft).toBeLessThan(100);
  });
});
