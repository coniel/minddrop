import React, { useCallback, useState } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
import { TranslationKey } from '@minddrop/i18n';
import { DropEventData, Selection } from '@minddrop/selection';
import { DropIndicator } from '@minddrop/ui-drag-and-drop';
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuTriggerProps,
  NameForm,
  Tooltip,
  propsToClass,
} from '@minddrop/ui-primitives';
import { useEntityGroupList } from '../EntityGroupListContext';
import { useDraggedEntityGroupItemIds } from '../useDraggedEntityGroupItemIds';
import { resolveEntityGroupDragSourceId } from '../utils';
import './EntityGroupGap.css';

type TriggerContextMenuHandler = NonNullable<
  ContextMenuTriggerProps['onContextMenu']
>;

export interface EntityGroupGapProps {
  /**
   * The position in the list the gap sits above.
   */
  index: number;

  /**
   * The ID of the group above the gap. Omitted for the gap above
   * the first group.
   */
  aboveGroupId?: string;

  /**
   * The ID of the group below the gap. Omitted for the gap below
   * the last group.
   */
  belowGroupId?: string;

  /**
   * Whether the gap takes up whatever room is left below the last
   * group.
   *
   * @default false
   */
  fill?: boolean;

  /**
   * Called with the dragged items and the group of the type they
   * were dragged out of, if any, when items are dropped in the gap,
   * standing up a group at its position.
   */
  onDropItems: (
    itemIds: string[],
    index: number,
    sourceGroupId: string | null,
  ) => void;

  /**
   * Called with the name given to the group a right click in the
   * gap asked for, to create at its position. Return an error
   * message for an invalid name. The naming stays open and shows it
   * below the field.
   */
  onCreateGroup: (
    index: number,
    name: string,
  ) => TranslationKey | void | Promise<TranslationKey | void>;

  /**
   * The group taking shape in the gap, rendered below its spacing.
   */
  children?: React.ReactNode;
}

/**
 * Renders the space between two groups, above the first or below
 * the last, which is what keeps the groups apart. Dropping items in
 * it stands up a group holding them, and right clicking it names a
 * new one.
 */
export const EntityGroupGap: React.FC<EntityGroupGapProps> = ({
  index,
  aboveGroupId,
  belowGroupId,
  fill = false,
  onDropItems,
  onCreateGroup,
  children,
}) => {
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<TranslationKey | null>(null);
  const { config, type } = useEntityGroupList();
  // The dragged items the group type accepts
  const draggedItemIds = useDraggedEntityGroupItemIds(config);

  // Whether the group above is collapsed. A missing group is looked
  // up under no ID, which is collapsed for nobody.
  const aboveCollapsed = EntityGroups.useCollapsed(type, aboveGroupId ?? '');
  // Whether the group below is collapsed
  const belowCollapsed = EntityGroups.useCollapsed(type, belowGroupId ?? '');
  // Whether the gap gives up its spacing. Only two collapsed groups
  // do that. The gap above the first group always keeps it.
  const compact =
    aboveGroupId !== undefined &&
    aboveCollapsed &&
    (belowGroupId === undefined || belowCollapsed);

  // Whether the gap takes the drag in progress. A drop stands up a
  // group of the dropped items.
  const acceptsDrop = draggedItemIds.length > 0;

  // Emit the dropped items and the group they were dragged out of
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      onDropItems(
        draggedItemIds,
        index,
        resolveEntityGroupDragSourceId(drop.origin, type),
      );
    },
    [draggedItemIds, index, type, onDropItems],
  );

  // Take drops in the gap
  const { droppableProps, isDraggingOver } = Selection.useDroppable({
    type: EntityGroups.constants.EntityType,
    id: `${type}:${index}`,
    claim: false,
    onDrop: handleDrop,
  });

  // The naming popover of a group taking shape in the gap renders in
  // a portal, so its own right clicks pass through the gap on their
  // way up the React tree. They are its, not the gap's.
  const handleContextMenu: TriggerContextMenuHandler = (event) => {
    if (!event.currentTarget.contains(event.target as Node)) {
      event.preventBaseUIHandler();
    }
  };

  // Start each naming afresh
  function handleNamingOpenChange(open: boolean) {
    if (open) {
      setName('');
      setError(null);
    }

    setNaming(open);
  }

  // Create the group, or show an error if the name is invalid
  async function handleSubmit(submittedName: string) {
    const submitError = await onCreateGroup(index, submittedName);

    if (submitError) {
      setError(submitError);

      return;
    }

    setNaming(false);
  }

  // Clear the error while the next name is typed
  function handleNameChange(value: string) {
    setName(value);
    setError(null);
  }

  // Render the spacing between the groups
  const gapElement = (
    <div
      className={propsToClass('entity-group-gap', { compact, fill })}
      {...(acceptsDrop ? droppableProps : {})}
    >
      {/* The spacing the indicator centres in. A tooltip opened by
          the drag rather than the pointer says what a drop there
          does. */}
      <Tooltip
        open={acceptsDrop && isDraggingOver}
        side="right"
        title="entityGroups.labels.newGroup"
        description="entityGroups.gap.drop"
      >
        <div className="entity-group-gap-spacing">
          <DropIndicator
            axis="horizontal"
            position="inside"
            show={acceptsDrop && isDraggingOver}
          />
        </div>
      </Tooltip>

      {children}
    </div>
  );

  return (
    <ContextMenuRoot open={naming} onOpenChange={handleNamingOpenChange}>
      <ContextMenuTrigger
        onContextMenu={handleContextMenu}
        render={gapElement}
      />

      {/* Names the group the right click asked for, where it was
          asked */}
      <ContextMenuPortal>
        <ContextMenuPositioner>
          <ContextMenuContent>
            <NameForm
              value={name}
              onValueChange={handleNameChange}
              placeholder="entityGroups.labels.newGroup"
              error={error ?? undefined}
              onSubmit={handleSubmit}
            />
          </ContextMenuContent>
        </ContextMenuPositioner>
      </ContextMenuPortal>
    </ContextMenuRoot>
  );
};
