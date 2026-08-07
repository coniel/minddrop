import { describe, expect, it } from 'vitest';
import { formatLogArgument } from './formatLogArgument';

describe('formatLogArgument', () => {
  it('returns strings as they were passed', () => {
    expect(formatLogArgument('a message')).toBe('a message');
  });

  it('formats errors by name and message', () => {
    expect(formatLogArgument(new TypeError('bad value'))).toBe(
      'TypeError: bad value',
    );
  });

  it('serializes objects and arrays', () => {
    expect(formatLogArgument({ a: 1 })).toBe('{\n  "a": 1\n}');
    expect(formatLogArgument([1, 2])).toBe('[\n  1,\n  2\n]');
  });

  it('falls back to the string form for unserializable values', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(formatLogArgument(circular)).toBe('[object Object]');
    expect(formatLogArgument(undefined)).toBe('undefined');
  });

  it('formats primitives', () => {
    expect(formatLogArgument(42)).toBe('42');
    expect(formatLogArgument(true)).toBe('true');
    expect(formatLogArgument(null)).toBe('null');
  });
});
