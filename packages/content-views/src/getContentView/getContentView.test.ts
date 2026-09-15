import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewNotFoundError } from '../errors';
import { cleanup, contentView_gallery_1, setup } from '../test-utils';
import { getContentView } from './getContentView';

const { workspace_2 } = WorkspaceFixtures;

describe('getContentView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the view does not exist', () => {
    expect(() => getContentView('missing-view')).toThrow(
      ContentViewNotFoundError,
    );
  });

  it('returns the view if it exists', () => {
    const view = getContentView(contentView_gallery_1.id);

    expect(view).toEqual(contentView_gallery_1);
  });

  it('returns null when throwOnNotFound is false and view does not exist', () => {
    expect(getContentView('missing-view', false)).toBeNull();
  });

  it('does not throw when throwOnNotFound is false', () => {
    expect(() => getContentView('missing-view', false)).not.toThrow();
  });

  it('retrieves the view from the given workspace', () => {
    expect(
      getContentView(contentView_gallery_1.id, false, workspace_2.id),
    ).toBeNull();
  });
});
