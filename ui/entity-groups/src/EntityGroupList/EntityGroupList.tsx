import React, { useCallback, useMemo, useState } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
import { TranslationKey } from '@minddrop/i18n';
import { Stack } from '@minddrop/ui-primitives';
import { EntityGroup } from '../EntityGroup';
import { EntityGroupListProvider } from '../EntityGroupListContext';
import { applyEntityGroupDrop } from '../applyEntityGroupDrop';
import { EntityGroupDropAction, ProtectedEntityGroupComponent } from '../types';
import { resolveDropOrder } from '../utils';
import { EntityGroupGap } from './EntityGroupGap';
import { EntityGroupPlaceholder } from './EntityGroupPlaceholder';

export interface EntityGroupListProps {
  /**
   * The group type to list the groups of.
   */
  type: string;

  /**
   * Renders an item listed in a group.
   */
  renderItem: (itemId: string) => React.ReactNode;

  /**
   * Components rendering the contents of the groups the app
   * provides, keyed by group ID. Used in place of the items the
   * group lists, for groups whose contents are not stored items.
   */
  protectedGroupComponents?: Record<string, ProtectedEntityGroupComponent>;

  /**
   * Empty state shown in a group listing no items.
   */
  emptyLabel?: TranslationKey;

  /**
   * Class name applied to the list element.
   */
  className?: string;
}

interface PlaceholderGroup {
  /**
   * The position in the list the group is stood up at.
   */
  index: number;

  /**
   * The IDs of the items dropped into it.
   */
  itemIds: string[];

  /**
   * The ID of the group the items came from, null when they were
   * dragged in from outside the list.
   */
  sourceGroupId: string | null;
}

/**
 * Renders a group type's groups in the order they are listed,
 * rearranged by dragging groups and their items around.
 *
 * Dropping items in the space between two groups stands up a group
 * there, which holds them once it has been named.
 */
export const EntityGroupList: React.FC<EntityGroupListProps> = ({
  type,
  renderItem,
  protectedGroupComponents,
  emptyLabel,
  className,
}) => {
  const [placeholder, setPlaceholder] = useState<PlaceholderGroup | null>(null);
  const groups = EntityGroups.useAll(type);
  const config = EntityGroups.getConfig(type);

  const context = useMemo(
    () => ({
      type,
      config,
      renderItem,
      protectedGroupComponents,
      emptyLabel,
    }),
    [type, config, renderItem, protectedGroupComponents, emptyLabel],
  );

  // Move the dropped group to the position it was dropped at
  const handleDropGroup = useCallback(
    (groupId: string, index: number) => {
      EntityGroups.reorder(
        type,
        resolveDropOrder(
          groups.map((group) => group.id),
          [groupId],
          index,
        ),
      );
    },
    [type, groups],
  );

  // Stand up a group at the position the items were dropped at,
  // which holds them once it has been named.
  const handleDropItems = useCallback(
    (itemIds: string[], index: number, sourceGroupId: string | null) => {
      setPlaceholder({ index, itemIds, sourceGroupId });
    },
    [],
  );

  // Create the group the items were dropped into and fill it
  async function handleCreateGroup(name: string) {
    if (!placeholder) {
      return;
    }

    const { index, itemIds, sourceGroupId } = placeholder;

    // Drop the placeholder, which the created group takes the place
    // of.
    setPlaceholder(null);

    // Create the group at the position it was stood up at. It is
    // created empty so that the model applies its own rules to each
    // item as it goes in, such as a protected group keeping the item
    // dragged out of it.
    const group = await EntityGroups.create(type, name, { index });

    // Fill the group with the items which were dropped into it
    await applyEntityGroupDrop(
      type,
      resolveNewGroupActions(group.id, itemIds, sourceGroupId),
    );
  }

  // Abandoning the naming leaves nothing behind, since none of it
  // was stored.
  function handleCancelGroup() {
    setPlaceholder(null);
  }

  // Render the gap above the group at the position, and the
  // placeholder group when it is being stood up there.
  function renderGap(index: number) {
    return (
      <React.Fragment key={`gap-${index}`}>
        <EntityGroupGap
          index={index}
          onDropGroup={handleDropGroup}
          onDropItems={handleDropItems}
        />
        {placeholder?.index === index && (
          <EntityGroupPlaceholder
            itemIds={placeholder.itemIds}
            onSubmit={handleCreateGroup}
            onCancel={handleCancelGroup}
          />
        )}
      </React.Fragment>
    );
  }

  return (
    <EntityGroupListProvider value={context}>
      <Stack gap={0} className={className}>
        {groups.map((group, index) => (
          <React.Fragment key={group.id}>
            {renderGap(index)}
            <EntityGroup group={group} />
          </React.Fragment>
        ))}
        {renderGap(groups.length)}
      </Stack>
    </EntityGroupListProvider>
  );
};

/**
 * Returns the actions filling a newly created group with the items
 * dropped into it: a move for items dragged out of another group,
 * an add for items dragged in from outside the list.
 */
function resolveNewGroupActions(
  groupId: string,
  itemIds: string[],
  sourceGroupId: string | null,
): EntityGroupDropAction[] {
  if (!sourceGroupId) {
    return itemIds.map((itemId, index) => ({
      action: 'add-item',
      groupId,
      itemId,
      index,
    }));
  }

  return itemIds.map((itemId, index) => ({
    action: 'move-item',
    fromGroupId: sourceGroupId,
    toGroupId: groupId,
    itemId,
    index,
  }));
}
