import React, { FC } from 'react';
import { UiIconName } from '@minddrop/icons';
import { mapPropsToClasses } from '@minddrop/utils';
import { Icon } from '../Icon';
import { Text } from '../Text';
import './ActionCard.css';

export interface ActionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon displayed at the top of the card.
   */
  icon: UiIconName;

  /**
   * The title.
   */
  title: string;

  /**
   * The description text.
   */
  description: string;

  /**
   * The action button.
   */
  action: React.ReactNode;
}

export const ActionCard: FC<ActionCardProps> = ({
  icon,
  title,
  description,
  action,
  className,
  ...other
}) => {
  return (
    <div className={mapPropsToClasses({ className }, 'action-card')} {...other}>
      <Icon name={icon} color="current-color" />
      <Text weight="bold" className="title">
        {title}
      </Text>
      <Text className="description">{description}</Text>
      <div className="action">{action}</div>
    </div>
  );
};
