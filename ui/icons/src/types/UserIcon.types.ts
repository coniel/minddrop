import { ContentColor } from '@minddrop/ui-theme';
import { ContentIconName } from './ContentIcon.types';

export enum UserIconType {
  Default = 'default',
  ContentIcon = 'content-icon',
}

export type UserIconDefault = { type: UserIconType.Default };

/**
 * Background treatment behind a content icon. Serialized as the
 * value, with None left out of icon strings.
 */
export enum ContentIconBackground {
  None = 'none',
  Subtle = 'subtle',
  Solid = 'solid',
}

export type UserIconContentIcon = {
  type: UserIconType.ContentIcon;
  set: string;
  icon: ContentIconName;
  color: ContentColor;
  // Left out when None
  background?: ContentIconBackground;
};

export type UserIcon = UserIconContentIcon;
