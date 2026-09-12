import { describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { resolveSpacesDirPath } from '../resolveSpacesDirPath';
import { parseSpaceBundlePath } from './parseSpaceBundlePath';

const { workspace_1 } = WorkspaceFixtures;

describe('parseSpaceBundlePath', () => {
  it('parses a path inside a space bundle', () => {
    expect(
      parseSpaceBundlePath(
        `${resolveSpacesDirPath(workspace_1.path)}/space_1/space.json`,
        workspace_1.path,
      ),
    ).toEqual({ id: 'space_1', bundlePath: 'space.json' });
  });

  it('parses a nested path inside a space bundle', () => {
    expect(
      parseSpaceBundlePath(
        `${resolveSpacesDirPath(workspace_1.path)}/space_1/media/image.png`,
        workspace_1.path,
      ),
    ).toEqual({ id: 'space_1', bundlePath: 'media/image.png' });
  });

  it('returns an empty bundle path for the bundle directory itself', () => {
    expect(
      parseSpaceBundlePath(
        `${resolveSpacesDirPath(workspace_1.path)}/space_1`,
        workspace_1.path,
      ),
    ).toEqual({
      id: 'space_1',
      bundlePath: '',
    });
  });

  it('returns null for paths outside the spaces directory', () => {
    expect(
      parseSpaceBundlePath('workspace/space_1/space.json', workspace_1.path),
    ).toBeNull();
  });

  it('returns null for the spaces directory itself', () => {
    expect(
      parseSpaceBundlePath(
        resolveSpacesDirPath(workspace_1.path),
        workspace_1.path,
      ),
    ).toBeNull();
  });
});
