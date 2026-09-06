import { ContentColor } from '@minddrop/ui-theme';
import { ContentIconName } from './ContentIcon.types';

export enum UserIconType {
  Default = 'default',
  ContentIcon = 'content-icon',
}

export type UserIconDefault = { type: UserIconType.Default };

export type UserIconContentIcon = {
  type: UserIconType.ContentIcon;
  set: string;
  icon: ContentIconName;
  color: ContentColor;
};

export type UserIcon = UserIconContentIcon;
