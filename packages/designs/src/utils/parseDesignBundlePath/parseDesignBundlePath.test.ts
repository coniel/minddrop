import { describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { resolveDesignsDirPath } from '../resolveDesignsDirPath';
import { parseDesignBundlePath } from './parseDesignBundlePath';

const { workspace_1 } = WorkspaceFixtures;

describe('parseDesignBundlePath', () => {
  it('parses a path inside a design bundle', () => {
    expect(
      parseDesignBundlePath(
        `${resolveDesignsDirPath(workspace_1.path)}/design_books/design.json`,
        workspace_1.path,
      ),
    ).toEqual({ id: 'design_books', bundlePath: 'design.json' });
  });

  it('parses a nested path inside a design bundle', () => {
    expect(
      parseDesignBundlePath(
        `${resolveDesignsDirPath(workspace_1.path)}/design_books/media/image.png`,
        workspace_1.path,
      ),
    ).toEqual({ id: 'design_books', bundlePath: 'media/image.png' });
  });

  it('returns an empty bundle path for the bundle directory itself', () => {
    expect(
      parseDesignBundlePath(
        `${resolveDesignsDirPath(workspace_1.path)}/design_books`,
        workspace_1.path,
      ),
    ).toEqual({ id: 'design_books', bundlePath: '' });
  });

  it('returns null for paths outside the designs directory', () => {
    expect(
      parseDesignBundlePath(
        'workspace/design_books/design.json',
        workspace_1.path,
      ),
    ).toBeNull();
  });

  it('returns null for the designs directory itself', () => {
    expect(
      parseDesignBundlePath(
        resolveDesignsDirPath(workspace_1.path),
        workspace_1.path,
      ),
    ).toBeNull();
  });
});
