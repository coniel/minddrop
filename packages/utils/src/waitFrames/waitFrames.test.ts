import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { waitFrames } from './waitFrames';

describe('waitFrames', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls back at once for zero frames', () => {
    let called = false;

    waitFrames(0, () => (called = true));

    expect(called).toBe(true);
  });

  it('calls back once the frames have passed', () => {
    let called = false;

    waitFrames(2, () => (called = true));

    vi.advanceTimersToNextFrame();

    expect(called).toBe(false);

    vi.advanceTimersToNextFrame();

    expect(called).toBe(true);
  });
});
