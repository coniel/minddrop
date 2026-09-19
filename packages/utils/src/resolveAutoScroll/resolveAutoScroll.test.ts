import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveAutoScroll } from './resolveAutoScroll';

// Edge zones of 100px scrolling at up to 10px per frame
const options = { edgeSize: 100, maxSpeed: 10 };

/**
 * Creates a scrollable element occupying the given bounds.
 *
 * @param rect - The element's bounds.
 * @param scroll - The element's scroll offsets and scroll size.
 * @returns The element.
 */
function createScrollable(
  rect: DOMRect,
  scroll: { left: number; top: number; width: number; height: number },
): HTMLElement {
  const element = document.createElement('div');

  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(rect);
  Object.defineProperties(element, {
    scrollLeft: { value: scroll.left, writable: true },
    scrollTop: { value: scroll.top, writable: true },
    scrollWidth: { value: scroll.width },
    scrollHeight: { value: scroll.height },
    clientWidth: { value: rect.width },
    clientHeight: { value: rect.height },
  });

  return element;
}

describe('resolveAutoScroll', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('scrolls nothing away from the edges', () => {
    const element = createScrollable(new DOMRect(0, 0, 1000, 1000), {
      left: 0,
      top: 0,
      width: 2000,
      height: 2000,
    });

    expect(resolveAutoScroll([element], 500, 500, options)).toEqual({
      x: null,
      y: null,
    });
  });

  it('scrolls the innermost element which can still scroll', () => {
    // Create an inner element scrolled to its bottom inside an outer
    // one with room left to scroll.
    const inner = createScrollable(new DOMRect(0, 0, 1000, 1000), {
      left: 0,
      top: 1000,
      width: 1000,
      height: 2000,
    });
    const outer = createScrollable(new DOMRect(0, 0, 1000, 1000), {
      left: 0,
      top: 0,
      width: 1000,
      height: 2000,
    });

    const scroll = resolveAutoScroll([inner, outer], 500, 990, options);

    expect(scroll.y?.element).toBe(outer);
    expect(scroll.y?.velocity).toBeGreaterThan(0);
  });

  it('scrolls an element however far the pointer has overshot it', () => {
    const element = createScrollable(new DOMRect(0, 0, 1000, 1000), {
      left: 100,
      top: 0,
      width: 2000,
      height: 2000,
    });

    const scroll = resolveAutoScroll([element], -800, 500, options);

    expect(scroll.x?.element).toBe(element);
    expect(scroll.x?.velocity).toBeLessThan(0);
  });

  it('ignores an axis the pointer is beside the element on', () => {
    // The pointer sits within the bottom edge zone's band, but off to
    // the right of the element.
    const element = createScrollable(new DOMRect(0, 0, 1000, 1000), {
      left: 0,
      top: 0,
      width: 2000,
      height: 2000,
    });

    const scroll = resolveAutoScroll([element], 1300, 990, options);

    expect(scroll.x?.velocity).toBeGreaterThan(0);
    expect(scroll.y).toBeNull();
  });

  it('scrolls each axis independently', () => {
    const element = createScrollable(new DOMRect(0, 0, 1000, 1000), {
      left: 100,
      top: 0,
      width: 2000,
      height: 2000,
    });

    const scroll = resolveAutoScroll([element], 10, 500, options);

    expect(scroll.x?.velocity).toBeLessThan(0);
    expect(scroll.y).toBeNull();
  });
});
