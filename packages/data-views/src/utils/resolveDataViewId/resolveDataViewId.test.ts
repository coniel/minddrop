import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ViewFileExtension, ViewsDirName } from '../../constants';
import {
  DataViewFixtures,
  cleanup,
  dataViewsRootPath,
  setup,
} from '../../test-utils';
import { resolveDataViewId } from './resolveDataViewId';

const { workspace_2 } = WorkspaceFixtures;
const { dataView_gallery_1 } = DataViewFixtures;

// View files are named by their ID
const viewFileName = Fs.addFileExtension(
  dataView_gallery_1.id,
  ViewFileExtension,
);

describe('resolveDataViewId', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('returns the ID of a view file', () => {
    expect(resolveDataViewId(`${dataViewsRootPath}/${viewFileName}`)).toBe(
      dataView_gallery_1.id,
    );
  });

  it('returns null for files which are not views', () => {
    expect(resolveDataViewId(`${dataViewsRootPath}/notes.md`)).toBeNull();
  });

  it('returns null for files outside a views directory', () => {
    expect(resolveDataViewId(`workspace/${viewFileName}`)).toBeNull();
  });

  it('returns null for view files in another workspace', () => {
    const path = Fs.concatPath(
      workspace_2.path,
      Paths.hiddenDirName,
      ViewsDirName,
      viewFileName,
    );

    expect(resolveDataViewId(path)).toBeNull();
  });

  it('returns null for files nested below a views directory', () => {
    expect(
      resolveDataViewId(`${dataViewsRootPath}/archive/${viewFileName}`),
    ).toBeNull();
  });
});
