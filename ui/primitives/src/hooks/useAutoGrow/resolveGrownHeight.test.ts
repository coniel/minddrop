import { describe, expect, it, vi } from 'vitest';
import { resolveGrownHeight } from './resolveGrownHeight';

/**
 * Creates a stand-in textarea reporting the given measurements.
 *
 * @param measurements - The heights the element reports.
 * @param styles - The computed styles to report.
 * @returns The stand-in element.
 */
function mockTextarea(
  measurements: { scrollHeight: number; clientHeight: number },
  styles: Partial<CSSStyleDeclaration> = {},
): HTMLTextAreaElement {
  const element = document.createElement('textarea');

  Object.defineProperty(element, 'scrollHeight', {
    value: measurements.scrollHeight,
  });
  Object.defineProperty(element, 'clientHeight', {
    value: measurements.clientHeight,
  });

  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    lineHeight: '20px',
    fontSize: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    ...styles,
  } as CSSStyleDeclaration);

  return element;
}

describe('resolveGrownHeight', () => {
  it('takes the height the content needs', () => {
    const element = mockTextarea({ scrollHeight: 120, clientHeight: 60 });

    expect(resolveGrownHeight(element, 20)).toBe(120);
  });

  it('floors at the height the rows ask for', () => {
    const element = mockTextarea({ scrollHeight: 40, clientHeight: 80 });

    expect(resolveGrownHeight(element, 20)).toBe(80);
  });

  it('caps at the max rows, padding included', () => {
    const element = mockTextarea({ scrollHeight: 400, clientHeight: 60 });

    // Four lines of twenty pixels, plus the sixteen pixels of padding
    expect(resolveGrownHeight(element, 4)).toBe(96);
  });

  it('falls back to a ratio of the font size for a normal line height', () => {
    const element = mockTextarea(
      { scrollHeight: 400, clientHeight: 60 },
      { lineHeight: 'normal' },
    );

    // Two lines of a 1.5 ratio over a sixteen pixel font, plus padding
    expect(resolveGrownHeight(element, 2)).toBe(64);
  });
});
