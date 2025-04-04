import React from 'react';
import {
  UserIcon as UserIconDef,
  UserIconType,
  useIcon,
} from '@minddrop/icons';
import { ContentIcon } from '../ContentIcon';
import './UserIcon.css';

export interface UserIconProps {
  /**
   * The stringified icon.
   */
  icon?: string;

  /**
   * The icon used as the default icon type in case
   * the stringified icon is not present or is invalid.
   */
  defaultIcon?: UserIconDef;
}

export const UserIcon: React.FC<UserIconProps> = ({
  icon: iconString,
  defaultIcon,
}) => {
  const { icon } = useIcon(iconString || '', defaultIcon);

  if (icon.type === UserIconType.Emoji) {
    return <span className="user-icon emoji">{icon.icon}</span>;
  }

  return (
    <span className="user-icon content-icon">
      <ContentIcon name={icon.icon} color={icon.color} />
    </span>
  );
};
