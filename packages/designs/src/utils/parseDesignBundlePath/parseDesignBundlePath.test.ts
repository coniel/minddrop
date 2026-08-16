import { describe, expect, it } from 'vitest';
import { resolveDesignsDirPath } from '../resolveDesignsDirPath';
import { parseDesignBundlePath } from './parseDesignBundlePath';

describe('parseDesignBundlePath', () => {
  it('parses a path inside a design bundle', () => {
    expect(
      parseDesignBundlePath(
        `${resolveDesignsDirPath()}/design_books/design.json`,
      ),
    ).toEqual({ id: 'design_books', bundlePath: 'design.json' });
  });

  it('parses a nested path inside a design bundle', () => {
    expect(
      parseDesignBundlePath(
        `${resolveDesignsDirPath()}/design_books/media/image.png`,
      ),
    ).toEqual({ id: 'design_books', bundlePath: 'media/image.png' });
  });

  it('returns an empty bundle path for the bundle directory itself', () => {
    expect(
      parseDesignBundlePath(`${resolveDesignsDirPath()}/design_books`),
    ).toEqual({ id: 'design_books', bundlePath: '' });
  });

  it('returns null for paths outside the designs directory', () => {
    expect(
      parseDesignBundlePath('workspace/design_books/design.json'),
    ).toBeNull();
  });

  it('returns null for the designs directory itself', () => {
    expect(parseDesignBundlePath(resolveDesignsDirPath())).toBeNull();
  });
});
