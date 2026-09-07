import { ContentColor } from '@minddrop/ui-theme';
import { ContentIconName } from './ContentIcon.types';

/**
 * Background treatment behind a content icon. Serialized as the
 * value, with None left out of icon strings.
 */
export enum ContentIconBackground {
  None = 'none',
  Subtle = 'subtle',
  Solid = 'solid',
}

/**
 * A content icon from an icon set, stored as
 * '<set>:<icon>:<color>' with an optional trailing
 * background segment.
 */
export type UserIcon = {
  set: string;
  icon: ContentIconName;
  color: ContentColor;
  // Left out when None
  background?: ContentIconBackground;
};
