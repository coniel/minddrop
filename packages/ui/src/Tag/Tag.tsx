import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './Tag.css';
import { ContentColor } from '../types';

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The tag label.
   */
  label: string;

  /**
   * The tag color.
   */
  color?: ContentColor;
}

export const Tag: FC<TagProps> = ({
  label,
  className,
  color = 'blue',
  ...other
}) => {
  return (
    <span className={mapPropsToClasses({ className, color }, 'tag')} {...other}>
      {label}
    </span>
  );
};
