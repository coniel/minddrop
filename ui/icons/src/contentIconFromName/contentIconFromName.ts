import { ContentColor } from '@minddrop/ui-theme';
import { BuiltInContentIconSetId } from '../constants';
import { stringifyIcon } from '../stringifyIcon';
import { ContentIconName, UserIconType } from '../types';

/**
 * Builds the string representation of a built-in content icon
 * from its name.
 *
 * @param name - The name of the content icon.
 * @param color - The color of the icon, defaults to the default colour.
 * @returns The string representation of the icon.
 */
export function contentIconFromName(
  name: ContentIconName,
  color: ContentColor = 'default',
): string {
  return stringifyIcon({
    type: UserIconType.ContentIcon,
    set: BuiltInContentIconSetId,
    icon: name,
    color,
  });
}
