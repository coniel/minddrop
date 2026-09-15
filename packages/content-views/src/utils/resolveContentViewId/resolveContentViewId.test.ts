import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewFileExtension, ContentViewsDirName } from '../../constants';
import {
  ContentViewFixtures,
  cleanup,
  contentViewsRootPath,
  setup,
} from '../../test-utils';
import { resolveContentViewId } from './resolveContentViewId';

const { workspace_2 } = WorkspaceFixtures;
const { contentView_gallery_1 } = ContentViewFixtures;

// View files are named by their ID
const viewFileName = Fs.addFileExtension(
  contentView_gallery_1.id,
  ContentViewFileExtension,
);

describe('resolveContentViewId', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('returns the ID of a view file', () => {
    expect(
      resolveContentViewId(`${contentViewsRootPath}/${viewFileName}`),
    ).toBe(contentView_gallery_1.id);
  });

  it('returns null for files which are not views', () => {
    expect(resolveContentViewId(`${contentViewsRootPath}/notes.md`)).toBeNull();
  });

  it('returns null for files outside a views directory', () => {
    expect(resolveContentViewId(`workspace/${viewFileName}`)).toBeNull();
  });

  it('returns null for view files in another workspace', () => {
    const path = Fs.concatPath(
      workspace_2.path,
      Paths.hiddenDirName,
      ContentViewsDirName,
      viewFileName,
    );

    expect(resolveContentViewId(path)).toBeNull();
  });

  it('returns null for files nested below a views directory', () => {
    expect(
      resolveContentViewId(`${contentViewsRootPath}/archive/${viewFileName}`),
    ).toBeNull();
  });
});
