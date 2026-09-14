import React, { useRef } from 'react';
import { MenuGroup, MenuLabel, NamePopover } from '@minddrop/ui-primitives';
import { useEntityGroupList } from '../EntityGroupListContext';
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
 * cannot be collapsed, dragged or rearranged.
 */
export const EntityGroupPlaceholder: React.FC<EntityGroupPlaceholderProps> = ({
  itemIds,
  onSubmit,
  onCancel,
}) => {
  const labelRef = useRef<HTMLDivElement>(null);
  const { renderItem } = useEntityGroupList();

  // Closing the popover without a name leaves nothing behind
  function handleOpenChange(open: boolean) {
    if (!open) {
      onCancel();
    }
  }

  return (
    <div className="entity-group-placeholder">
      <MenuGroup>
        {/* The header is what is being named, so it is the one part
            shown as the target */}
        <MenuLabel
          ref={labelRef}
          highlighted
          label="entityGroups.labels.newGroup"
        />
        <MenuGroup>
          {itemIds.map((itemId) => (
            <div key={itemId} className="entity-group-placeholder-item">
              {renderItem(itemId)}
            </div>
          ))}
        </MenuGroup>
      </MenuGroup>

      {/* Anchored to the header it names rather than the whole
          placeholder, so it opens beneath the header */}
      <NamePopover
        open
        anchor={labelRef}
        placeholder="entityGroups.name.placeholder"
        onOpenChange={handleOpenChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};
