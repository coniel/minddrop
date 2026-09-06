import { BuiltInContentIconSetId } from '../constants';
import { UserIconContentIcon, UserIconType } from '../types';

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

export const contentIconString = 'content-icon:cat:cyan';
export const setContentIconString = 'content-icon:my-icons:cat:green';
