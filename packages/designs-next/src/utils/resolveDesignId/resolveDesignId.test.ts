import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignFixtures, cleanup, setup } from '../../test-utils';
import { resolveDesignFilePath } from '../resolveDesignFilePath';
import { resolveDesignsDirPath } from '../resolveDesignsDirPath';
import { resolveDesignId } from './resolveDesignId';

const { workspace_1, workspace_2 } = WorkspaceFixtures;
const { cardDesign_1 } = DesignFixtures;

describe('resolveDesignId', () => {
  beforeEach(() => setup());

  afterEach(cleanup);

  it('returns the ID of a design file', () => {
    expect(
      resolveDesignId(
        resolveDesignFilePath(cardDesign_1.id, workspace_1.path),
        workspace_1.path,
      ),
    ).toBe(cardDesign_1.id);
  });

  it('defaults to the active workspace', () => {
    expect(
      resolveDesignId(resolveDesignFilePath(cardDesign_1.id, workspace_1.path)),
    ).toBe(cardDesign_1.id);
  });

  it('returns null for files which are not designs', () => {
    expect(
      resolveDesignId(
        `${resolveDesignsDirPath(workspace_1.path)}/notes.md`,
        workspace_1.path,
      ),
    ).toBeNull();
  });

  it('returns null for files outside the designs directory', () => {
    expect(
      resolveDesignId(
        Fs.concatPath(workspace_1.path, `${cardDesign_1.id}.json`),
        workspace_1.path,
      ),
    ).toBeNull();
  });

  it('returns null for design files in another workspace', () => {
    expect(
      resolveDesignId(
        resolveDesignFilePath(cardDesign_1.id, workspace_2.path),
        workspace_1.path,
      ),
    ).toBeNull();
  });

  it('returns null for files nested below the designs directory', () => {
    expect(
      resolveDesignId(
        `${resolveDesignsDirPath(workspace_1.path)}/archive/${cardDesign_1.id}.json`,
        workspace_1.path,
      ),
    ).toBeNull();
  });
});
