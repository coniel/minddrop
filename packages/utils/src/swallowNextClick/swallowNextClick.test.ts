import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { swallowNextClick } from './swallowNextClick';

describe('swallowNextClick', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  /**
   * Clicks the body.
   *
   * @returns Whether the click reached the body.
   */
  function click(): boolean {
    let reached = false;

    document.body.addEventListener('click', () => (reached = true), {
      once: true,
    });
    document.body.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );

    return reached;
  }

  it('swallows the next click', () => {
    swallowNextClick();

    expect(click()).toBe(false);
  });

  it('lets the click after the next through', () => {
    swallowNextClick();
    click();

    expect(click()).toBe(true);
  });

  it('stops waiting for a click on the next task', () => {
    swallowNextClick();
    vi.runAllTimers();

    expect(click()).toBe(true);
  });
});
