import { ContentColor } from '@minddrop/ui-theme';
import { BuiltInContentIconSetId } from '../constants';
import {
  ContentIconBackground,
  ContentIconName,
  UserIcon,
  UserIconType,
} from '../types';

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

  // Stringified icon config is in the format 'type:icon:color', with
  // an optional icon set segment: 'type:set:icon:color', and an
  // optional trailing background segment: 'type:icon:color:background'.
  const segments = iconString.split(':');
  const background = parseBackgroundSegment(segments[segments.length - 1]);

  // Dropping the background segment first leaves the set detection
  // to the segment count alone.
  if (background !== null) {
    segments.pop();
  }

  const icon = parseIconSegments(segments);

  if (!icon) {
    return null;
  }

  // The default background is left out of the parsed icon
  if (background !== null && background !== ContentIconBackground.None) {
    icon.background = background;
  }

  return icon;
}

/**
 * Parses the icon segments, without any background segment.
 */
function parseIconSegments(segments: string[]): UserIcon | null {
  const [type, icon, color] = segments;

  if (type !== UserIconType.ContentIcon) {
    return null;
  }

  // Four segments carry the icon set explicitly
  if (segments.length === 4) {
    return {
      type,
      set: segments[1],
      icon: segments[2] as ContentIconName,
      color: segments[3] as ContentColor,
    };
  }

  // Unqualified icons belong to the built-in set
  return {
    type,
    set: BuiltInContentIconSetId,
    icon: icon as ContentIconName,
    color: color as ContentColor,
  };
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
