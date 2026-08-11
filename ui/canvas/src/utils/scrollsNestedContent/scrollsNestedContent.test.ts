import { afterEach, describe, expect, it } from 'vitest';
import { scrollsNestedContent } from './scrollsNestedContent';

// Builds a viewport containing a scrollable element which
// contains the wheel event's target
function render(options: {
  overflow: string;
  axis: 'x' | 'y';
  scrollable: boolean;
}): { viewport: HTMLElement; target: HTMLElement } {
  const viewport = document.createElement('div');
  const scroller = document.createElement('div');
  const target = document.createElement('div');

  scroller.style.overflowX = options.axis === 'x' ? options.overflow : 'hidden';
  scroller.style.overflowY = options.axis === 'y' ? options.overflow : 'hidden';

  // jsdom does not lay elements out, so the scroll extents are
  // set directly
  const extent = options.axis === 'x' ? 'scrollWidth' : 'scrollHeight';
  const size = options.axis === 'x' ? 'clientWidth' : 'clientHeight';

  Object.defineProperty(scroller, extent, {
    value: options.scrollable ? 500 : 100,
  });
  Object.defineProperty(scroller, size, { value: 100 });

  scroller.appendChild(target);
  viewport.appendChild(scroller);
  document.body.appendChild(viewport);

  return { viewport, target };
}

// A wheel event with the given deltas, dispatched from the target
function wheelEvent(
  target: HTMLElement,
  deltaX: number,
  deltaY: number,
): WheelEvent {
  const event = new WheelEvent('wheel', { deltaX, deltaY, bubbles: true });

  Object.defineProperty(event, 'target', { value: target });

  return event;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('scrollsNestedContent', () => {
  it('returns true when an ancestor scrolls vertically', () => {
    const { viewport, target } = render({
      overflow: 'auto',
      axis: 'y',
      scrollable: true,
    });

    expect(scrollsNestedContent(wheelEvent(target, 0, 10), viewport)).toBe(
      true,
    );
  });

  it('returns true when an ancestor scrolls horizontally', () => {
    const { viewport, target } = render({
      overflow: 'scroll',
      axis: 'x',
      scrollable: true,
    });

    expect(scrollsNestedContent(wheelEvent(target, 10, 0), viewport)).toBe(
      true,
    );
  });

  it('returns false when the scroll is along the other axis', () => {
    const { viewport, target } = render({
      overflow: 'auto',
      axis: 'y',
      scrollable: true,
    });

    expect(scrollsNestedContent(wheelEvent(target, 10, 0), viewport)).toBe(
      false,
    );
  });

  it('returns false when the content fits its container', () => {
    const { viewport, target } = render({
      overflow: 'auto',
      axis: 'y',
      scrollable: false,
    });

    expect(scrollsNestedContent(wheelEvent(target, 0, 10), viewport)).toBe(
      false,
    );
  });

  it('returns false when no ancestor is scrollable', () => {
    const { viewport, target } = render({
      overflow: 'hidden',
      axis: 'y',
      scrollable: true,
    });

    expect(scrollsNestedContent(wheelEvent(target, 0, 10), viewport)).toBe(
      false,
    );
  });
});
