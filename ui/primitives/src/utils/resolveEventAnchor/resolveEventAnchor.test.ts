import { describe, expect, it } from 'vitest';
import { resolveEventAnchor } from './resolveEventAnchor';

describe('resolveEventAnchor', () => {
  it('anchors at the coordinates of a pointer event', () => {
    const anchor = resolveEventAnchor(
      new MouseEvent('contextmenu', { clientX: 120, clientY: 80 }),
    );

    const rect = (
      anchor as { getBoundingClientRect: () => Record<string, number> }
    ).getBoundingClientRect();

    expect(rect).toMatchObject({ x: 120, y: 80, width: 0, height: 0 });
  });

  it('returns null for events without coordinates', () => {
    expect(resolveEventAnchor(new KeyboardEvent('keydown'))).toBeNull();
  });

  it('returns null for clicks fired by keyboard activation', () => {
    // Activating a control by keyboard fires a click at the
    // viewport origin
    expect(
      resolveEventAnchor(new MouseEvent('click', { clientX: 0, clientY: 0 })),
    ).toBeNull();
  });
});
