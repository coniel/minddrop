import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { serializeDataView } from '../serializeDataView';
import { cleanup, dataView_virtual_1, setup } from '../test-utils';
import { StoredDataView } from '../types';
import { deserializeDataView } from './deserializeDataView';

describe('deserializeDataView', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it('restores the date fields', () => {
    // A stored view as parsed from JSON, with dates as ISO strings
    const storedView = JSON.parse(
      JSON.stringify(serializeDataView(dataView_virtual_1)),
    ) as StoredDataView;

    const view = deserializeDataView(storedView);

    expect(view.created).toBeInstanceOf(Date);
    expect(view.lastModified).toBeInstanceOf(Date);
  });

  it('round-trips a serialized view', () => {
    const storedView = serializeDataView(dataView_virtual_1, {
      dataSource: false,
    });

    expect(deserializeDataView(storedView)).toEqual(storedView);
  });
});
