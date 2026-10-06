import { describe, expect, it } from 'vitest';
import { parseCodeFenceOpening } from './parseCodeFenceOpening';

describe('parseCodeFenceOpening', () => {
  it('parses the marker of a backtick fence', () => {
    expect(parseCodeFenceOpening('```')).toBe('```');
    expect(parseCodeFenceOpening('````')).toBe('````');
  });

  it('parses the marker of a tilde fence', () => {
    expect(parseCodeFenceOpening('~~~')).toBe('~~~');
  });

  it('parses the marker of a fence followed by an info string', () => {
    expect(parseCodeFenceOpening('```json')).toBe('```');
  });

  it('parses no marker from a backtick fence whose info string contains a backtick', () => {
    expect(parseCodeFenceOpening('```a`b')).toBeNull();
  });

  it('parses the marker of a tilde fence whose info string contains a backtick', () => {
    expect(parseCodeFenceOpening('~~~a`b')).toBe('~~~');
  });

  it('parses no marker from fewer than three backticks', () => {
    expect(parseCodeFenceOpening('``')).toBeNull();
  });

  it('parses no marker from text', () => {
    expect(parseCodeFenceOpening('Text ```')).toBeNull();
  });
});
