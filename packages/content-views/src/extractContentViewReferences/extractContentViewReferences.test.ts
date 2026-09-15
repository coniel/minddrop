import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  contentViewType_gallery,
  contentViewType_referencing,
  setup,
} from '../test-utils';
import { extractContentViewReferences } from './extractContentViewReferences';

describe('extractContentViewReferences', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('extracts the referenced item IDs from the config', () => {
    expect(
      extractContentViewReferences(contentViewType_referencing.type, {
        data: { items: ['database-entry_one', 'database-entry_two'] },
      }),
    ).toEqual(['database-entry_one', 'database-entry_two']);
  });

  it('returns an empty array for view types without the hook', () => {
    expect(
      extractContentViewReferences(contentViewType_gallery.type, {
        data: { items: ['database-entry_one'] },
      }),
    ).toEqual([]);
  });

  it('returns an empty array for unregistered view types', () => {
    expect(extractContentViewReferences('unregistered', {})).toEqual([]);
  });
});
