import { afterEach, describe, expect, it } from 'vitest';
import { DataTypesStore } from '../DataTypesStore';
import { coreDataTypes } from '../data-type-configs';
import { cleanup } from '../test-utils';
import { initializeDataTypes } from './initializeDataTypes';

describe('initializeDataTypes', () => {
  afterEach(cleanup);

  it('loads data types into the store', async () => {
    initializeDataTypes();

    expect(DataTypesStore.getAll()).toEqual(
      coreDataTypes.map((dataType) => ({
        ...dataType,
        name: expect.any(String),
        description: expect.any(String),
        properties: dataType.properties.map((property) => ({
          ...property,
          name: expect.any(String),
          description: expect.any(String),
        })),
        automations: dataType.automations
          ? dataType.automations.map((automation) => ({
              ...automation,
              name: expect.any(String),
              description: expect.any(String),
              property: expect.any(String),
              actions: automation.actions.map((action) => ({
                ...action,
                propertyMapping: expect.any(Object),
              })),
            }))
          : undefined,
      })),
    );
  });
});
