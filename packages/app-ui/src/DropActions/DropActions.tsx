import React, { FC, useState } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './DropActions.css';
import { DropParentReference } from '@minddrop/drops';
import { Toolbar } from '@minddrop/ui';
import { DropDropdownMenu } from '../DropDropdownMenu';

export interface DropActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The ID of the drop.
   */
  dropId: string;

  /**
   * The reference to the parent inside which the
   * drop is rendered.
   */
  parent?: DropParentReference;

  /**
   * Additional actions. Should be IconButtons.
   */
  children?: React.ReactNode;
}

export const DropActions: FC<DropActionsProps> = ({
  dropId,
  parent,
  children,
  className,
  ...other
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      data-testid="drop-actions"
      className={mapPropsToClasses({ className, visible }, 'drop-actions')}
      {...other}
    >
      {parent && parent.type === 'topic' && (
        <Toolbar>
          {children}
          <DropDropdownMenu
            dropId={dropId}
            topicId={parent.id}
            onOpenChange={setVisible}
          />
        </Toolbar>
      )}
    </div>
  );
};
