import { Fs } from '@minddrop/file-system';
import { ItemTypes } from '@minddrop/item-types';
import { isMarkdownItemType } from '@minddrop/item-types/src/utils';
import { Markdown } from '@minddrop/markdown';
import { Properties } from '@minddrop/properties';
import { getItem } from '../getItem';
import {
  itemCorePropertiesFilePath,
  itemUserPropertiesFilePath,
} from '../utils';

/**
 * Writes an item to the file system.
 *
 * @param path - The item's path.
 */
export async function writeItem(path: string): Promise<void> {
  // Geth the item
  const item = getItem(path);
  // Get the item type config
  const typeConfig = ItemTypes.get(item.type);

  // Write the item's core properties
  Fs.writeTextFile(
    itemCorePropertiesFilePath(path),
    Properties.stringify({
      title: item.title,
      created: item.created,
      lastModified: item.lastModified,
    }),
  );

  // Add the item's type specific properties to the markdown content
  // as frontmatter
  const markdownFileContents = Markdown.setProperties(
    item.markdown,
    item.properties,
  );

  // Wite the item's markdown file. If the item type is markdown based,
  // write it to the item's path. Otherwise, write it to the item type's
  // user properties subdirectory.
  if (isMarkdownItemType(typeConfig)) {
    Fs.writeTextFile(path, markdownFileContents);
  } else {
    Fs.writeTextFile(itemUserPropertiesFilePath(path), markdownFileContents);
  }
}
