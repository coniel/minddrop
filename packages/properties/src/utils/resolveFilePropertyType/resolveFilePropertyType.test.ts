import { describe, expect, it } from 'vitest';
import { resolveFilePropertyType } from './resolveFilePropertyType';

describe('resolveFilePropertyType', () => {
  it('resolves image extensions', () => {
    expect(resolveFilePropertyType('png')).toBe('image');
  });

  it('resolves the pdf extension', () => {
    expect(resolveFilePropertyType('pdf')).toBe('pdf');
  });

  it('resolves audio extensions', () => {
    expect(resolveFilePropertyType('mp3')).toBe('audio');
  });

  it('resolves video extensions', () => {
    expect(resolveFilePropertyType('mp4')).toBe('video');
  });

  it('falls back to the catch-all type', () => {
    expect(resolveFilePropertyType('epub')).toBe('file');
  });

  it('ignores case and a leading dot', () => {
    expect(resolveFilePropertyType('.PNG')).toBe('image');
  });
});
