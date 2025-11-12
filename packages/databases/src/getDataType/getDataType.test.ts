import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ObjectDataType } from '../data-type-configs';
import { DataTypeNotFoundError } from '../errors';
import { cleanup, setup } from '../test-utils';
import { getDataType } from './getDataType';

describe('getDataType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves the data type', () => {
    const dataType = getDataType(ObjectDataType.type);

    expect(dataType).toEqual(ObjectDataType);
  });

  it('throws if the data type does not exist', () => {
    expect(() => getDataType('non-existent-type')).toThrow(
      DataTypeNotFoundError,
    );
  });

  it('returns null if the data type does not exist and throwOnNotFound is false', () => {
    const dataType = getDataType('non-existent-type', false);

    expect(dataType).toBeNull();
  });
});
