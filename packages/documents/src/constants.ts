import { Icons, UserIcon, UserIconType } from '@minddrop/icons';

export const DefaultDocumentIcon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'text',
  color: 'default',
};

export const DefaultDocumentIconString = Icons.stringify(DefaultDocumentIcon);

export const DefaultDocumentMetadata = {
  icon: DefaultDocumentIconString,
};

export const DefaultDocumentProperties = {
  icon: DefaultDocumentIconString,
};
