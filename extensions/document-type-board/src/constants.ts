import { Icons, UserIconType } from '@minddrop/icons';

export const DefaultBoardIcon = Icons.stringify({
  type: UserIconType.ContentIcon,
  icon: 'kanban-square',
  color: 'default',
});

export const DefaultBoardProperties = {
  icon: DefaultBoardIcon,
};
