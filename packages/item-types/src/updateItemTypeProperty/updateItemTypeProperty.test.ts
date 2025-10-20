import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertySchema, PropertyType } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { cleanup, markdownItemTypeConfig, setup } from '../test-utils';
import { updateItemTypeProperty } from './updateItemTypeProperty';

const updatedProperty = {
  ...markdownItemTypeConfig.properties[0],
  defaultValue: 'Updated Default Value',
} as PropertySchema;

const updatedItemType = {
  ...markdownItemTypeConfig,
  properties: [updatedProperty],
};

describe('updateItemTypeProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the property name is changed', async () => {
    await expect(
      updateItemTypeProperty(markdownItemTypeConfig.type, {
        ...markdownItemTypeConfig.properties[0],
        name: 'New Name',
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the property type is changed', async () => {
    await expect(
      // @ts-expect-error Testing invalid parameter
      updateItemTypeProperty(markdownItemTypeConfig.type, {
        ...markdownItemTypeConfig.properties[0],
        type: PropertyType.Number,
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('updates the property in the item type', async () => {
    const result = await updateItemTypeProperty(
      markdownItemTypeConfig.type,
      updatedProperty,
    );

    expect(result).toEqual(updatedItemType);
  });

  it('updates the item type', async () => {
    await updateItemTypeProperty(markdownItemTypeConfig.type, updatedProperty);

    expect(ItemTypeConfigsStore.get(markdownItemTypeConfig.type)).toEqual(
      updatedItemType,
    );
  });
});
