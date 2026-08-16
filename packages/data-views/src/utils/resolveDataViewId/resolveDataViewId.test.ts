import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, dataViewsRootPath, setup } from '../../test-utils';
import { resolveDataViewId } from './resolveDataViewId';

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

  it('returns null for files nested below a views directory', () => {
    expect(
      resolveDataViewId(
        `${dataViewsRootPath}/archive/data-view_gallery-1.json`,
      ),
    ).toBeNull();
  });
});
