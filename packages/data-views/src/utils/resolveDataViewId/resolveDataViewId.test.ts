import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ViewsDirName } from '../../constants';
import { cleanup, dataViewsRootPath, setup } from '../../test-utils';
import { resolveDataViewId } from './resolveDataViewId';

const { workspace_2 } = WorkspaceFixtures;

describe('resolveDataViewId', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('returns the ID of a view file', () => {
    expect(
      resolveDataViewId(`${dataViewsRootPath}/data-view_gallery-1.json`),
    ).toBe('data-view_gallery-1');
  });

  it('returns null for files which are not views', () => {
    expect(resolveDataViewId(`${dataViewsRootPath}/notes.md`)).toBeNull();
  });

  it('returns null for files outside a views directory', () => {
    expect(resolveDataViewId('workspace/data-view_gallery-1.json')).toBeNull();
  });

  it('returns null for view files in another workspace', () => {
    const path = Fs.concatPath(
      workspace_2.path,
      Paths.hiddenDirName,
      ViewsDirName,
      'data-view_gallery-1.json',
    );

    expect(resolveDataViewId(path)).toBeNull();
  });

  it('returns null for files nested below a views directory', () => {
    expect(
      resolveDataViewId(
        `${dataViewsRootPath}/archive/data-view_gallery-1.json`,
      ),
    ).toBeNull();
  });
});
