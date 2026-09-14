import React, { useCallback, useMemo, useState } from 'react';
import {
  EntityGroup as EntityGroupType,
  EntityGroups,
} from '@minddrop/entity-groups';
import { TranslationKey } from '@minddrop/i18n';
import {
  SortableItemRenderProps,
  SortableList,
} from '@minddrop/ui-drag-and-drop';
import { propsToClass } from '@minddrop/ui-primitives';
import { EntityGroup } from '../EntityGroup';
import { EntityGroupListProvider } from '../EntityGroupListContext';
import { applyEntityGroupDrop } from '../applyEntityGroupDrop';
import {
  EntityGroupAddAction,
  EntityGroupDropAction,
  ProtectedEntityGroupComponent,
} from '../types';
import { EntityGroupGap } from './EntityGroupGap';
import { EntityGroupPlaceholder } from './EntityGroupPlaceholder';
import './EntityGroupList.css';

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
   * Returns the label a group is shown under, for groups whose name
   * is the app's rather than the user's, or null for groups which
   * are shown under their stored name.
   */
  resolveLabel?: (group: EntityGroupType) => TranslationKey | null;

  /**
   * Returns the add control shown in a group's label row, or null
   * for groups which take no adding.
   */
  resolveAddAction?: (group: EntityGroupType) => EntityGroupAddAction | null;

  /**
   * Whether a new group is being named at the top of the list. It is
   * created once it has a name, and nothing is stored until then.
   */
  namingNewGroup?: boolean;

  /**
   * Called when the new group is named or the naming is abandoned.
   */
  onNamingNewGroupChange?: (naming: boolean) => void;

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
   * dragged in from outside the type's groups.
   */
  sourceGroupId: string | null;
}

/**
 * Renders a group type's groups in the order they are listed,
 * rearranged by dragging groups and their items around.
 *
 * Dropping items in the space between two groups stands up a group
 * there, which holds them once it has been named. Right clicking the
 * space names a new group there.
 */
export const EntityGroupList: React.FC<EntityGroupListProps> = ({
  type,
  renderItem,
  protectedGroupComponents,
  resolveLabel,
  resolveAddAction,
  namingNewGroup = false,
  onNamingNewGroupChange,
  className,
}) => {
  const [standingPlaceholder, setStandingPlaceholder] =
    useState<PlaceholderGroup | null>(null);
  const groups = EntityGroups.useAll(type);
  const config = EntityGroups.getConfig(type);

  // The group taking shape: the one stood up in a gap, or an empty
  // one at the top of the list when the consumer asks for a new
  // group.
  const placeholder =
    standingPlaceholder ??
    (namingNewGroup ? { index: 0, itemIds: [], sourceGroupId: null } : null);

  const context = useMemo(
    () => ({
      type,
      config,
      renderItem,
      protectedGroupComponents,
      resolveLabel,
      resolveAddAction,
    }),
    [
      type,
      config,
      renderItem,
      protectedGroupComponents,
      resolveLabel,
      resolveAddAction,
    ],
  );

  // List the groups in the order they were dragged into
  const handleSortGroups = useCallback(
    (groupIds: string[]) => {
      EntityGroups.reorder(type, groupIds);
    },
    [type],
  );

  // Stand up a group at the position the items were dropped at,
  // which holds them once it has been named.
  const handleDropItems = useCallback(
    (itemIds: string[], index: number, sourceGroupId: string | null) => {
      setStandingPlaceholder({ index, itemIds, sourceGroupId });
    },
    [],
  );

  // Make the named group, empty, at the position
  const handleCreateNamedGroup = useCallback(
    (index: number, name: string) => {
      EntityGroups.create(type, name, { index });
    },
    [type],
  );

  // Create the group the items were dropped into and fill it
  async function handleCreateGroup(name: string) {
    if (!placeholder) {
      return;
    }

    const { index, itemIds, sourceGroupId } = placeholder;

    // Drop the placeholder, which the created group takes the place
    // of.
    clearPlaceholder();

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
    clearPlaceholder();
  }

  // Take down the placeholder, whichever way it was stood up
  function clearPlaceholder() {
    setStandingPlaceholder(null);
    onNamingNewGroupChange?.(false);
  }

  // Render a group, dragged by its label to a new position in the
  // list, and the gap below it. The last group's gap is the one
  // filling the rest of the list, rendered outside the sortable
  // items so that it does not stretch the group's own.
  function renderGroup(groupId: string, sortable: SortableItemRenderProps) {
    const index = groups.findIndex(({ id }) => id === groupId);
    const group = groups[index];

    if (!group) {
      return null;
    }

    return (
      <div
        ref={sortable.ref}
        style={sortable.style}
        className={sortable.className}
      >
        <EntityGroup group={group} dragHandleProps={sortable.handleProps} />
        {index < groups.length - 1 &&
          renderGap(index + 1, group.id, groups[index + 1].id)}
      </div>
    );
  }

  // Render the gap above the group at the position, holding the
  // placeholder group when it is being stood up there.
  function renderGap(
    index: number,
    aboveGroupId?: string,
    belowGroupId?: string,
    fill?: boolean,
  ) {
    return (
      <EntityGroupGap
        index={index}
        aboveGroupId={aboveGroupId}
        belowGroupId={belowGroupId}
        fill={fill}
        onDropItems={handleDropItems}
        onCreateGroup={handleCreateNamedGroup}
      >
        {placeholder?.index === index && (
          <EntityGroupPlaceholder
            itemIds={placeholder.itemIds}
            onSubmit={handleCreateGroup}
            onCancel={handleCancelGroup}
          />
        )}
      </EntityGroupGap>
    );
  }

  const lastGroup = groups[groups.length - 1];

  return (
    <EntityGroupListProvider value={context}>
      <div className={propsToClass('entity-group-list', { className })}>
        {/* The gap above the first group */}
        {renderGap(0, undefined, groups[0]?.id)}

        <SortableList
          direction="vertical"
          gap={0}
          items={groups.map((group) => group.id)}
          renderItem={renderGroup}
          onSort={handleSortGroups}
        />

        {/* The gap below the last group, taking up the rest */}
        {renderGap(groups.length, lastGroup?.id, undefined, true)}
      </div>
    </EntityGroupListProvider>
  );
};

/**
 * Returns the actions filling a newly created group with the items
 * dropped into it: a move for items dragged out of another of the
 * type's groups, an add for items dragged in from outside them.
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
