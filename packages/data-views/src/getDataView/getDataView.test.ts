import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DataViewNotFoundError } from '../errors';
import { cleanup, dataView_gallery_1, setup } from '../test-utils';
import { getDataView } from './getDataView';

const { workspace_2 } = WorkspaceFixtures;

describe('getDataView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the view does not exist', () => {
    expect(() => getDataView('missing-view')).toThrow(DataViewNotFoundError);
  });

  it('returns the view if it exists', () => {
    const view = getDataView(dataView_gallery_1.id);

    expect(view).toEqual(dataView_gallery_1);
  });

  it('returns null when throwOnNotFound is false and view does not exist', () => {
    expect(getDataView('missing-view', false)).toBeNull();
  });

  it('does not throw when throwOnNotFound is false', () => {
    expect(() => getDataView('missing-view', false)).not.toThrow();
  });

  it('retrieves the view from the given workspace', () => {
    expect(
      getDataView(dataView_gallery_1.id, false, workspace_2.id),
    ).toBeNull();
  });
});
