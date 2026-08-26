import { describe, expect, it } from 'vitest';
import { resolveBadgeColorCss } from './resolveBadgeColorCss';

describe('resolveBadgeColorCss', () => {
  it('falls back to the neutral chip without a colour', () => {
    expect(resolveBadgeColorCss()).toEqual({
      backgroundColor: 'var(--neutral-300)',
      color: 'var(--text-muted)',
    });
  });

  it('treats the default colour as neutral', () => {
    expect(resolveBadgeColorCss('default')).toEqual(resolveBadgeColorCss());
  });

  it('pairs a content colour with its readable text step', () => {
    expect(resolveBadgeColorCss('cyan')).toEqual({
      backgroundColor: 'var(--cyan-400)',
      color: 'var(--cyan-1100)',
    });
  });
});
