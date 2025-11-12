import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataTypesStore } from '../DataTypesStore';
import { ObjectDataType } from '../data-type-configs';
import { DataTypeNotFoundError } from '../errors';
import { cleanup, setup } from '../test-utils';
import { unregisterDataType } from './unregisterDataType';

describe('unregisterDataType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the data type from the store', () => {
    unregisterDataType(ObjectDataType.type);

    expect(DataTypesStore.get(ObjectDataType.type)).toBeFalsy();
  });

  it('throws if the data type does not exist', () => {
    expect(() => unregisterDataType('non-existent-type')).toThrow(
      DataTypeNotFoundError,
    );
  });

  it('dispatches a data type unregister event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        'data-types:data-type:unregister',
        'test',
        (payload) => {
          // Payload data should be the data type config
          expect(payload.data).toEqual(ObjectDataType);
          done();
        },
      );

      unregisterDataType(ObjectDataType.type);
    }));
});
