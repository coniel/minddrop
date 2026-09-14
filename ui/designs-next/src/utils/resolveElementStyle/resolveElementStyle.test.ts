import { describe, expect, it } from 'vitest';
import { titleDesignElement } from '@minddrop/designs-next/test-utils';
import { resolveElementStyle } from './resolveElementStyle';

describe('resolveElementStyle', () => {
  it("resolves the element's own settings", () => {
    const style = resolveElementStyle({
      ...titleDesignElement,
      fontFamily: 'serif',
      fontSize: 18,
      lineHeight: 1.6,
      fontWeight: 300,
      textAlign: 'center',
      verticalAlign: 'bottom',
      background: 'accent',
      cornerRadius: 'lg',
    });

    expect(style).toMatchObject({
      fontFamily: 'var(--font-serif)',
      fontSize: 18,
      lineHeight: 1.6,
      fontWeight: 300,
      textAlign: 'center',
      justifyContent: 'flex-end',
      backgroundColor: 'var(--surface-accent)',
      borderRadius: 'var(--radius-lg)',
    });
  });

  it('falls back to the given defaults', () => {
    const style = resolveElementStyle(titleDesignElement, {
      fontSize: 24,
      fontWeight: 600,
    });

    expect(style).toMatchObject({ fontSize: 24, fontWeight: 600 });
  });

  it('prefers the element over the defaults', () => {
    const style = resolveElementStyle(
      { ...titleDesignElement, fontSize: 18 },
      { fontSize: 24 },
    );

    expect(style.fontSize).toBe(18);
  });

  it('leaves out a setting neither carries', () => {
    const style = resolveElementStyle(titleDesignElement);

    expect(style.fontSize).toBeUndefined();
    expect(style.backgroundColor).toBeUndefined();
  });

  it('draws both decorations where both are set', () => {
    const style = resolveElementStyle({
      ...titleDesignElement,
      underline: true,
      strikethrough: true,
    });

    expect(style.textDecorationLine).toBe('underline line-through');
  });

  it('spreads the custom styles over the resolved ones', () => {
    const style = resolveElementStyle(
      { ...titleDesignElement, fontSize: 18 },
      {},
      { fontSize: 32, minHeight: 40 },
    );

    expect(style).toMatchObject({ fontSize: 32, minHeight: 40 });
  });
});
