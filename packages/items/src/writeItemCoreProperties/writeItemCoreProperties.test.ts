import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Properties } from '@minddrop/properties';
import { MockFs, cleanup, markdownItem1, setup } from '../test-utils';
import { itemCoreProperties, itemCorePropertiesFilePath } from '../utils';
import { writeItemCoreProperties } from './writeItemCoreProperties';

describe('writeItemCoreProperties', () => {
  beforeEach(() => {
    setup({ loadItems: true });

    const propertiesFilePath = itemCorePropertiesFilePath(markdownItem1.path);
    MockFs.removeFile(propertiesFilePath);
  });

  afterEach(cleanup);

  it('writes the item properties to the core properties file', async () => {
    await writeItemCoreProperties(markdownItem1.path);

    const writtenPropertiesText = MockFs.readTextFile(
      itemCorePropertiesFilePath(markdownItem1.path),
    );

    const writtenProperties = Properties.parse(writtenPropertiesText);

    expect(writtenProperties).toEqual(itemCoreProperties(markdownItem1));
  });
});
