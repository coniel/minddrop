import { afterEach, describe, expect, it } from 'vitest';
import { isDragInProgress } from './isDragInProgress';

describe('isDragInProgress', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-dragging');
  });

  it('is false while nothing is dragged', () => {
    expect(isDragInProgress()).toBe(false);
  });

  it('is true while the document is marked as dragging', () => {
    document.documentElement.setAttribute('data-dragging', '');

    expect(isDragInProgress()).toBe(true);
  });
});
