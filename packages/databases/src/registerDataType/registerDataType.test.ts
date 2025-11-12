import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataTypesStore } from '../DataTypesStore';
import { ObjectDataType } from '../data-type-configs';
import { cleanup, setup } from '../test-utils';
import { DataType } from '../types';
import { registerDataType } from './registerDataType';

const newDataType: DataType = {
  ...ObjectDataType,
  type: 'custom-type',
};

describe('registerDataType', () => {
  beforeEach(() => setup({ loadDataTypes: false }));

  afterEach(cleanup);

  it('adds the data type to the store', () => {
    registerDataType(newDataType);

    expect(DataTypesStore.get(newDataType.type)).toEqual(newDataType);
  });

  it('overwrites existing data types with the same type', () => {
    registerDataType(newDataType);

    const modifiedDataType: DataType = {
      ...newDataType,
      name: 'Modified Data Type',
    };

    registerDataType(modifiedDataType);

    expect(DataTypesStore.get(newDataType.type)).toEqual(modifiedDataType);
  });

  it('dispatches a data type register event', async () =>
    new Promise<void>((done) => {
      Events.addListener('data-types:data-type:register', 'test', (payload) => {
        // Payload data should be the data type config
        expect(payload.data).toEqual(newDataType);
        done();
      });

      registerDataType(newDataType);
    }));
});
