import React, { useRef } from 'react';
import { SidebarGroup } from '@minddrop/ui-components';
import { useEntityGroupList } from '../EntityGroupListContext';
import { EntityGroupNamePopover } from '../EntityGroupNamePopover';
import './EntityGroupPlaceholder.css';

export interface EntityGroupPlaceholderProps {
  /**
   * The IDs of the items the group is being stood up around.
   */
  itemIds: string[];

  /**
   * Called with the group's name once it is confirmed.
   */
  onSubmit: (name: string) => void;

  /**
   * Called when the naming is abandoned, dropping the placeholder.
   */
  onCancel: () => void;
}

/**
 * Renders the group taking shape where items were dropped between
 * two groups, holding them while it waits for its name. It is not a
 * group until the name is confirmed, so it takes no drops and
 * cannot be dragged or rearranged.
 */
export const EntityGroupPlaceholder: React.FC<EntityGroupPlaceholderProps> = ({
  itemIds,
  onSubmit,
  onCancel,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const { renderItem } = useEntityGroupList();

  // Closing the popover without a name leaves nothing behind
  function handleOpenChange(open: boolean) {
    if (!open) {
      onCancel();
    }
  }

  return (
    <div ref={anchorRef} className="entity-group-placeholder">
      <SidebarGroup label="entityGroups.labels.newGroup">
        {itemIds.map((itemId) => (
          <div key={itemId} className="entity-group-placeholder-item">
            {renderItem(itemId)}
          </div>
        ))}
      </SidebarGroup>

      <EntityGroupNamePopover
        open
        anchor={anchorRef}
        onOpenChange={handleOpenChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};
