import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import {
  PropertiesSchema,
  cleanup,
  fileDescriptors,
  markdownItem1,
  setup,
} from '../test-utils';
import { generateItemPropertiesFilePath } from '../utils';
import { writeItemProperties } from './writeItemProperties';

const MockFs = initializeMockFileSystem(fileDescriptors);

describe('writeItemProperties', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('writes the item properties to the properties file', async () => {
    const newProperties = {
      number: 50,
      boolean: false,
    };

    await writeItemProperties(
      markdownItem1.path,
      {
        ...markdownItem1.properties,
        ...newProperties,
      },
      PropertiesSchema,
    );

    const writtenPropertiesText = MockFs.readTextFile(
      generateItemPropertiesFilePath(markdownItem1.path),
    );

    expect(Properties.parse(writtenPropertiesText, PropertiesSchema)).toEqual({
      ...markdownItem1.properties,
      ...newProperties,
    });
  });
});
