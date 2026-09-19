import { describe, expect, it } from 'vitest';
import { resolveNearestElement } from './resolveNearestElement';

// Creates an element measured at the given bounds
function createElement(x: number, y: number, size: number): Element {
  const element = document.createElement('div');

  element.getBoundingClientRect = () =>
    ({
      x,
      y,
      left: x,
      top: y,
      width: size,
      height: size,
      right: x + size,
      bottom: y + size,
      toJSON: () => ({}),
    }) as DOMRect;

  return element;
}

describe('resolveNearestElement', () => {
  it('resolves the element whose centre is nearest the point', () => {
    const near = createElement(0, 0, 10);
    const far = createElement(100, 100, 10);

    expect(resolveNearestElement([far, near], { x: 8, y: 8 })).toBe(near);
  });

  it('returns null when given no elements', () => {
    expect(resolveNearestElement([], { x: 0, y: 0 })).toBeNull();
  });
});
