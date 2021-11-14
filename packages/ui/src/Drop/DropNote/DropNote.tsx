import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './DropNote.css';

export interface DropNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content title.
   */
  children?: React.ReactNode;
}

export const DropNote: FC<DropNoteProps> = ({
  children,
  className,
  ...other
}) => {
  return (
    <div className={mapPropsToClasses({ className }, 'drop-note')} {...other}>
      {children}
    </div>
  );
};
