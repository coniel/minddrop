import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { ContentColor } from '../types';
import './Tag.css';

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
}) => (
  <span className={mapPropsToClasses({ className, color }, 'tag')} {...other}>
    {label}
  </span>
);
