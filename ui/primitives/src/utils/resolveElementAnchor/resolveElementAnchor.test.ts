import { describe, expect, it, vi } from 'vitest';
import { resolveElementAnchor } from './resolveElementAnchor';

describe('resolveElementAnchor', () => {
  it('anchors at the element position', () => {
    const element = document.createElement('button');

    // jsdom reports a zero rect for every element, so the position
    // is stubbed
    element.getBoundingClientRect = vi.fn(
      () => ({ x: 30, y: 12, width: 24, height: 24 }) as DOMRect,
    );

    const anchor = resolveElementAnchor(element) as {
      getBoundingClientRect: () => Record<string, number>;
    };

    expect(anchor.getBoundingClientRect()).toMatchObject({
      x: 30,
      y: 12,
      width: 24,
      height: 24,
    });
  });

  it('keeps the position after the element moves', () => {
    const element = document.createElement('button');
    const rect = { x: 30, y: 12, width: 24, height: 24 };

    element.getBoundingClientRect = vi.fn(() => rect as DOMRect);

    const anchor = resolveElementAnchor(element) as {
      getBoundingClientRect: () => Record<string, number>;
    };

    rect.x = 200;

    expect(anchor.getBoundingClientRect()).toMatchObject({ x: 30 });
  });

  it('returns null without an element', () => {
    expect(resolveElementAnchor(null)).toBeNull();
  });
});
