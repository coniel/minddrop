import { UserIconType } from '@minddrop/icons';
import { PageMetadata, SerializedPageMetadata } from '../../types';
import { stringify } from 'yaml';

/**
 * Serializes and stringifies page metadata into YAML front
 * matter. If no metadata beyond default values is present,
 * returns an empty string.
 *
 * @param metadata - The page metadata.
 * @returns Stringified serialized metadata.
 */
export function serializePageMetadata(metadata: PageMetadata): string {
  const serializedMetadata: SerializedPageMetadata = {};

  // Handle content-icon icon
  if (metadata.icon?.type === UserIconType.ContentIcon) {
    serializedMetadata.icon = `${UserIconType.ContentIcon}:${
      metadata.icon.icon as string
    }:${metadata.icon.color}`;
  }

  // Handle emoji icon
  if (metadata.icon?.type === UserIconType.Emoji) {
    serializedMetadata.icon = `${UserIconType.Emoji}:${metadata.icon.icon}:${metadata.icon.skinTone}`;
  }

  // If there is no metadata, don't generate serialized
  // version.
  if (!Object.keys(serializedMetadata).length) {
    return '';
  }

  return `---\n${stringify(serializedMetadata)}---\n\n`;
}
