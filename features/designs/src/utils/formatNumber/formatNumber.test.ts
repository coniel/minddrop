import { describe, expect, it } from 'vitest';
import { formatNumber, formatNumberParts } from './formatNumber';

describe('formatNumber', () => {
  it('formats with defaults (no decimals, no separator)', () => {
    expect(formatNumber(1234.56)).toBe('1235');
  });

  it('formats with decimal places', () => {
    expect(formatNumber(1234.567, { decimals: 2 })).toBe('1234.57');
  });

  it('applies a comma thousands separator', () => {
    expect(formatNumber(1234567, { thousandsSeparator: 'comma' })).toBe(
      '1,234,567',
    );
  });

  it('applies a period thousands separator', () => {
    expect(formatNumber(1234567, { thousandsSeparator: 'period' })).toBe(
      '1.234.567',
    );
  });

  it('applies a space thousands separator', () => {
    expect(formatNumber(1234567, { thousandsSeparator: 'space' })).toBe(
      '1 234 567',
    );
  });

  it('separates only the integer part', () => {
    expect(
      formatNumber(1234567.891, { decimals: 3, thousandsSeparator: 'comma' }),
    ).toBe('1,234,567.891');
  });

  it('prepends the prefix and appends the suffix', () => {
    expect(formatNumber(42, { prefix: '$', suffix: ' USD' })).toBe('$42 USD');
  });

  it('shows the negative sign by default', () => {
    expect(formatNumber(-42)).toBe('-42');
  });

  it('hides the sign when signDisplay is never', () => {
    expect(formatNumber(-42, { signDisplay: 'never' })).toBe('42');
  });

  it('shows the positive sign when signDisplay is always', () => {
    expect(formatNumber(42, { signDisplay: 'always' })).toBe('+42');
  });

  it('does not sign zero when signDisplay is always', () => {
    expect(formatNumber(0, { signDisplay: 'always' })).toBe('0');
  });
});

describe('formatNumberParts', () => {
  it('returns the prefix, number and suffix separately', () => {
    expect(
      formatNumberParts(1000, {
        prefix: '$',
        suffix: ' USD',
        thousandsSeparator: 'comma',
      }),
    ).toEqual({ prefix: '$', number: '1,000', suffix: ' USD' });
  });

  it('returns empty affixes by default', () => {
    expect(formatNumberParts(5)).toEqual({
      prefix: '',
      number: '5',
      suffix: '',
    });
  });
});
