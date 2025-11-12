import { afterEach, describe, expect, it } from 'vitest';
import { DataTypesStore } from '../DataTypesStore';
import { coreDataTypes } from '../data-type-configs';
import { cleanup } from '../test-utils';
import { initializeDataTypes } from './initializeDataTypes';

describe('initializeDataTypes', () => {
  afterEach(cleanup);

  it('loads data types into the store', async () => {
    initializeDataTypes();

    expect(DataTypesStore.getAll()).toEqual(coreDataTypes);
  });
});
