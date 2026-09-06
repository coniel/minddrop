import { useMemo } from 'react';
import { ContentColor } from '@minddrop/ui-theme';
import { BuiltInContentIconSetId } from './constants';
import { parseIcon } from './parseIcon';
import { resolveContentIconColor } from './resolveContentIconColor';
import { UserIcon, UserIconType } from './types';

interface IconData {
  // The parsed icon
  icon: UserIcon;

  // The icon color
  color?: ContentColor;
}

/**
 * Parses an icon string and returns the icon along with its color.
 *
 * @param iconString - The string representation of the icon.
 * @param defaultIcon - The default icon to use if the icon string is invalid.
 * @returns The icon data.
 */
export function useIcon(iconString?: string, defaultIcon?: UserIcon): IconData {
  const icon: UserIcon = useMemo(
    () =>
      (iconString && parseIcon(iconString)) ||
      defaultIcon || {
        type: UserIconType.ContentIcon,
        set: BuiltInContentIconSetId,
        icon: 'file',
        color: 'default',
      },
    [iconString, defaultIcon],
  );
  const color = useMemo(() => resolveContentIconColor(icon), [icon]);

  return { icon, color };
}
