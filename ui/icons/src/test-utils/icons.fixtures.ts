import { BuiltInContentIconSetId } from '../constants';
import {
  ContentIconBackground,
  UserIconContentIcon,
  UserIconType,
} from '../types';

export const contentIcon: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  set: BuiltInContentIconSetId,
  icon: 'cat',
  color: 'cyan',
};

export const setContentIcon: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  set: 'my-icons',
  icon: 'cat',
  color: 'green',
};

export const backgroundContentIcon: UserIconContentIcon = {
  ...contentIcon,
  background: ContentIconBackground.Solid,
};

export const setBackgroundContentIcon: UserIconContentIcon = {
  ...setContentIcon,
  background: ContentIconBackground.Subtle,
};

export const contentIconString = 'content-icon:cat:cyan';
export const setContentIconString = 'content-icon:my-icons:cat:green';
export const backgroundContentIconString = 'content-icon:cat:cyan:solid';
export const setBackgroundContentIconString =
  'content-icon:my-icons:cat:green:subtle';
