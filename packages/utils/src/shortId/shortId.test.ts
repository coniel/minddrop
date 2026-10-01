import { describe, expect, it } from 'vitest';
import { shortId } from './shortId';

describe('shortId', () => {
  it('generates eight lowercase letters or digits by default', () => {
    expect(shortId()).toMatch(/^[a-z0-9]{8}$/);
  });

  it('generates the requested length', () => {
    expect(shortId(12)).toHaveLength(12);
  });

  it('draws a different ID each time', () => {
    expect(shortId()).not.toBe(shortId());
  });
});
