import { DefaultContentIconSetId } from '../constants';
import { ContentIconBackground, UserIcon } from '../types';

export const contentIcon: UserIcon = {
  set: DefaultContentIconSetId,
  icon: 'cat',
  color: 'cyan',
};

export const setContentIcon: UserIcon = {
  set: 'my-icons',
  icon: 'cat',
  color: 'green',
};

export const backgroundContentIcon: UserIcon = {
  ...contentIcon,
  background: ContentIconBackground.Solid,
};

export const setBackgroundContentIcon: UserIcon = {
  ...setContentIcon,
  background: ContentIconBackground.Subtle,
};

export const contentIconString = 'lucide:cat:cyan';
export const setContentIconString = 'my-icons:cat:green';
export const backgroundContentIconString = 'lucide:cat:cyan:solid';
export const setBackgroundContentIconString = 'my-icons:cat:green:subtle';
