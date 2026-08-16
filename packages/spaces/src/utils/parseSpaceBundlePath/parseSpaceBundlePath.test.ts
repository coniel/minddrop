import { describe, expect, it } from 'vitest';
import { resolveSpacesDirPath } from '../resolveSpacesDirPath';
import { parseSpaceBundlePath } from './parseSpaceBundlePath';

describe('parseSpaceBundlePath', () => {
  it('parses a path inside a space bundle', () => {
    expect(
      parseSpaceBundlePath(`${resolveSpacesDirPath()}/space_1/space.json`),
    ).toEqual({ id: 'space_1', bundlePath: 'space.json' });
  });

  it('parses a nested path inside a space bundle', () => {
    expect(
      parseSpaceBundlePath(`${resolveSpacesDirPath()}/space_1/media/image.png`),
    ).toEqual({ id: 'space_1', bundlePath: 'media/image.png' });
  });

  it('returns an empty bundle path for the bundle directory itself', () => {
    expect(parseSpaceBundlePath(`${resolveSpacesDirPath()}/space_1`)).toEqual({
      id: 'space_1',
      bundlePath: '',
    });
  });

  it('returns null for paths outside the spaces directory', () => {
    expect(parseSpaceBundlePath('workspace/space_1/space.json')).toBeNull();
  });

  it('returns null for the spaces directory itself', () => {
    expect(parseSpaceBundlePath(resolveSpacesDirPath())).toBeNull();
  });
});
