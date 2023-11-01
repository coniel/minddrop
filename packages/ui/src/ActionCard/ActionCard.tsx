import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './ActionCard.css';
import { IconName } from '@minddrop/icons';
import { Icon } from '../Icon';
import { Text } from '../Text';

export interface ActionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon displayed at the top of the card.
   */
  icon: IconName;

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
