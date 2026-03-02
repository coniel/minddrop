import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWindowSizeSlot } from './getWindowSizeSlot';

describe('getWindowSizeSlot', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns "xs" when window width is below 1024', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800);

    expect(getWindowSizeSlot()).toBe('xs');
  });

  it('returns "sm" when window width is 1024–1919', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024);

    expect(getWindowSizeSlot()).toBe('sm');
  });

  it('returns "md" when window width is 1920–2559', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1920);

    expect(getWindowSizeSlot()).toBe('md');
  });

  it('returns "lg" when window width is 2560–3839', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(2560);

    expect(getWindowSizeSlot()).toBe('lg');
  });

  it('returns "xl" when window width is 3840 or above', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(3840);

    expect(getWindowSizeSlot()).toBe('xl');
  });
});
