import { Fs } from '@minddrop/file-system';
import { ItemTypes } from '@minddrop/item-types';
import { isMarkdownItemType } from '@minddrop/item-types/src/utils';
import { Markdown } from '@minddrop/markdown';
import { Properties } from '@minddrop/properties';
import { Item, ItemCoreProperties } from '../types';
import {
  itemCorePropertiesFilePath,
  itemUserPropertiesFilePath,
} from '../utils';

/**
 * Reads an item from the file system.
 *
 * @param type - The item type.
 * @param path - The item's file path.
 * @returns The item or null if it doesn't exist.
 */
export async function readItem(
  type: string,
  path: string,
): Promise<Item | null> {
  let coreProperties: ItemCoreProperties;
  let userPropertiesFileContent = '';
  const typeConfig = ItemTypes.get(type);

  // Check if the file exists
  if (!(await Fs.exists(path))) {
    return null;
  }

  // Get the core properties from the core properties file
  const corePropertiesPath = itemCorePropertiesFilePath(path);

  if (await Fs.exists(corePropertiesPath)) {
    // Read the core properties file
    const content = await Fs.readTextFile(corePropertiesPath);
    coreProperties = Properties.parse(content);
  } else {
    // If the core properties file doesn't exist, the file is not
    // an existing item.
    return null;
  }

  // If the item is markdown based, read its properties from the
  // primary file. Otherwise, read the user properties file.
  if (isMarkdownItemType(typeConfig)) {
    if (!path.endsWith('.md')) {
      // If the item is markdown based but the file is not a markdown file,
      // the file does not represent a valid item.
      return null;
    }

    // Read the user properties from the markdown file
    userPropertiesFileContent = await Fs.readTextFile(path);
  } else {
    const userPropertiesPath = itemUserPropertiesFilePath(path);

    // Ensure the user properties file exists before reading it.
    // If it doesn't exist, the item will have empty properties.
    if (await Fs.exists(userPropertiesPath)) {
      userPropertiesFileContent = await Fs.readTextFile(userPropertiesPath);
    }
  }

  // Generate the item from its properties
  const userProperties = Markdown.getProperties(userPropertiesFileContent);
  const markdown = Markdown.getContent(userPropertiesFileContent);

  return {
    ...coreProperties,
    path,
    type,
    markdown,
    properties: userProperties,
  };
}
