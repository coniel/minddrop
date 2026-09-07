import { ContentColor } from '@minddrop/ui-theme';
import { DefaultContentIconSetId } from '../constants';
import { stringifyIcon } from '../stringifyIcon';
import { ContentIconName } from '../types';

/**
 * Builds the string representation of a default set content
 * icon from its name.
 *
 * @param name - The name of the content icon.
 * @param color - The color of the icon, defaults to the default colour.
 * @returns The string representation of the icon.
 */
export function contentIconFromName(
  name: ContentIconName,
  color: ContentColor = 'default',
): string {
  return stringifyIcon({ set: DefaultContentIconSetId, icon: name, color });
}
