import { describe, expect, it } from 'vitest';
import { formatNumber } from './formatNumber';

describe('formatNumber', () => {
  it('keeps the places the number has by default', () => {
    expect(formatNumber(1234.5)).toBe('1234.5');
    expect(formatNumber(1.23456)).toBe('1.23456');
  });

  it('formats the number at the decimal places given', () => {
    expect(formatNumber(1234.5, { decimals: 2 })).toBe('1234.50');
  });

  it('rounds the last decimal place', () => {
    expect(formatNumber(1234.56, { decimals: 1 })).toBe('1234.6');
  });

  it('leaves the digits ungrouped by default', () => {
    expect(formatNumber(1234567)).toBe('1234567');
  });

  it('groups the digits with a comma', () => {
    expect(formatNumber(1234567.5, { separator: 'comma' })).toBe('1,234,567.5');
  });

  it('groups the digits with a period, taking a comma as the decimal mark', () => {
    expect(formatNumber(1234567.5, { separator: 'period' })).toBe(
      '1.234.567,5',
    );
  });

  it('groups the digits with a space', () => {
    expect(formatNumber(1234567.5, { separator: 'space' })).toBe('1 234 567.5');
  });

  it('signs negative numbers alone by default', () => {
    expect(formatNumber(-5)).toBe('-5');
    expect(formatNumber(5)).toBe('5');
  });

  it('signs every number but zero when set to always', () => {
    expect(formatNumber(5, { signDisplay: 'always' })).toBe('+5');
    expect(formatNumber(-5, { signDisplay: 'always' })).toBe('-5');
    expect(formatNumber(0, { signDisplay: 'always' })).toBe('0');
  });

  it('leaves a negative number rounded to zero unsigned by default', () => {
    expect(formatNumber(-0.4, { decimals: 0 })).toBe('0');
  });

  it('writes a large number compact when set to', () => {
    expect(formatNumber(12345.678, { notation: 'compact' })).toBe('12.3k');
    expect(formatNumber(12000, { notation: 'compact' })).toBe('12k');
    expect(formatNumber(1234567890, { notation: 'compact' })).toBe('1.2bn');
  });

  it('writes a compact number at the decimal places given', () => {
    expect(formatNumber(12345.678, { notation: 'compact', decimals: 1 })).toBe(
      '12.3k',
    );
  });

  it('signs no number when set to never', () => {
    expect(formatNumber(-5, { signDisplay: 'never' })).toBe('5');
  });
});
