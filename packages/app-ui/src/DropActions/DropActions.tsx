import React, { FC, useState } from 'react';
import { ResourceReference } from '@minddrop/resources';
import { mapPropsToClasses } from '@minddrop/utils';
import { Toolbar } from '@minddrop/ui';
import { DropDropdownMenu } from '../DropDropdownMenu';
import { DropTrashActions } from '../DropTrashActions';
import './DropActions.css';

export interface DropActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The ID of the drop.
   */
  dropId: string;

  /**
   * The reference to the parent inside which the
   * drop is rendered.
   */
  currentParent?: ResourceReference;

  /**
   * Additional actions. Should be IconButtons.
   */
  children?: React.ReactNode;
}

export const DropActions: FC<DropActionsProps> = ({
  dropId,
  currentParent,
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
      {currentParent && currentParent.resource === 'topics:topic' && (
        <Toolbar>
          {children}
          <DropDropdownMenu
            dropId={dropId}
            topicId={currentParent.id}
            onOpenChange={setVisible}
          />
        </Toolbar>
      )}
      {currentParent &&
        currentParent.resource === 'app:view' &&
        currentParent.id === 'app:trash' && (
          <DropTrashActions dropId={dropId} onDropdownOpenChange={setVisible} />
        )}
    </div>
  );
};
