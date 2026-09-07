import { ContentColor } from '@minddrop/ui-theme';
import { ContentIconBackground, ContentIconName, UserIcon } from '../types';

/**
 * Parses a UserIcon from its string representation.
 *
 * @param iconString - The string representation of the icon.
 * @returns A UserIcon or null if the an icon could not be matched.
 */
export function parseIcon(iconString?: string): UserIcon | null {
  if (!iconString) {
    return null;
  }

  // Stringified icons are in the format 'set:icon:color', with an
  // optional trailing background segment: 'set:icon:color:background'.
  const [set, icon, color, background, ...rest] = iconString.split(':');

  if (!set || !icon || !color || rest.length) {
    return null;
  }

  const parsedIcon: UserIcon = {
    set,
    icon: icon as ContentIconName,
    color: color as ContentColor,
  };

  if (background === undefined) {
    return parsedIcon;
  }

  const parsedBackground = parseBackgroundSegment(background);

  // A trailing segment which is not a background is not an icon
  if (parsedBackground === null) {
    return null;
  }

  // The default background is left out of the parsed icon
  if (parsedBackground !== ContentIconBackground.None) {
    parsedIcon.background = parsedBackground;
  }

  return parsedIcon;
}

const BackgroundSegments: Record<string, ContentIconBackground> = {
  [ContentIconBackground.None]: ContentIconBackground.None,
  [ContentIconBackground.Subtle]: ContentIconBackground.Subtle,
  [ContentIconBackground.Solid]: ContentIconBackground.Solid,
};

/**
 * Parses a background segment, returning null when the segment
 * is not a background value.
 */
function parseBackgroundSegment(segment: string): ContentIconBackground | null {
  if (!(segment in BackgroundSegments)) {
    return null;
  }

  return BackgroundSegments[segment];
}
