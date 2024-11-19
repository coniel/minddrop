import { Icons, UserIconType } from '@minddrop/extension';

export const DefaultBoardIcon = Icons.stringify({
  type: UserIconType.ContentIcon,
  icon: 'kanban-square',
  color: 'default',
});

export const DefaultBoardProperties = {
  icon: DefaultBoardIcon,
};
