import { Icons, UserIconType } from '@minddrop/icons';

export const DefaultDocumentIcon = Icons.stringify({
  type: UserIconType.ContentIcon,
  icon: 'text',
  color: 'default',
});

export const DefaultNoteProperties = {
  icon: DefaultDocumentIcon,
};
