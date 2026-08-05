import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  dataViewType_gallery,
  dataViewType_referencing,
  setup,
} from '../test-utils';
import { extractDataViewReferences } from './extractDataViewReferences';

describe('extractDataViewReferences', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('extracts the referenced item IDs from the config', () => {
    expect(
      extractDataViewReferences(dataViewType_referencing.type, {
        data: { items: ['database-entry_one', 'database-entry_two'] },
      }),
    ).toEqual(['database-entry_one', 'database-entry_two']);
  });

  it('returns an empty array for view types without the hook', () => {
    expect(
      extractDataViewReferences(dataViewType_gallery.type, {
        data: { items: ['database-entry_one'] },
      }),
    ).toEqual([]);
  });

  it('returns an empty array for unregistered view types', () => {
    expect(extractDataViewReferences('unregistered', {})).toEqual([]);
  });
});
