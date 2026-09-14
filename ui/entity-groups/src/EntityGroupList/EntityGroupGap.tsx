import React, { useCallback, useState } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
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
import { useDraggedEntityGroupItems } from '../useDraggedEntityGroupItems';
import {
  resolveEntityGroupDragSource,
  resolveEntityGroupDropTypes,
} from '../utils';
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
   * gap asked for, to make at its position.
   */
  onCreateGroup: (index: number, name: string) => void;

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
  const { config, type } = useEntityGroupList();
  const draggedItems = useDraggedEntityGroupItems(config);

  // The gap gives up its spacing only between collapsed groups: a
  // collapsed group above an expanded one keeps them apart, and the
  // gap above the first group always does. A missing group is
  // looked up under no ID, which is collapsed for nobody.
  const aboveCollapsed = EntityGroups.useCollapsed(type, aboveGroupId ?? '');
  const belowCollapsed = EntityGroups.useCollapsed(type, belowGroupId ?? '');
  const compact =
    aboveGroupId !== undefined &&
    aboveCollapsed &&
    (belowGroupId === undefined || belowCollapsed);

  // The gap takes the entities the type's groups can hold, which
  // land in a group of their own.
  const acceptsDrop = draggedItems.length > 0;

  const handleDrop = useCallback(
    (drop: DropEventData) => {
      onDropItems(
        draggedItems,
        index,
        resolveEntityGroupDragSource(drop.event, type),
      );
    },
    [draggedItems, index, type, onDropItems],
  );

  const { droppableProps, isDraggingOver } = Selection.useDroppable({
    type: EntityGroups.constants.EntityType,
    id: `${type}:${index}`,
    claim: false,
    accepts: resolveEntityGroupDropTypes(config),
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
    }

    setNaming(open);
  }

  // Naming the group makes it, and is the end of the naming
  function handleSubmit(submittedName: string) {
    onCreateGroup(index, submittedName);
    setNaming(false);
  }

  return (
    <ContextMenuRoot open={naming} onOpenChange={handleNamingOpenChange}>
      <ContextMenuTrigger
        onContextMenu={handleContextMenu}
        render={
          <div
            className={propsToClass('entity-group-gap', { compact, fill })}
            {...(acceptsDrop ? droppableProps : {})}
          >
            {/* The spacing itself, which the indicator centres in. What
                a drop there does is said beside it: a native drag
                suspends hover, so the tooltip is opened by the drag
                rather than the pointer. */}
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
        }
      />

      {/* Names the group the right click asked for, where it was
          asked */}
      <ContextMenuPortal>
        <ContextMenuPositioner>
          <ContextMenuContent>
            <NameForm
              value={name}
              onValueChange={setName}
              placeholder="entityGroups.labels.newGroup"
              onSubmit={handleSubmit}
            />
          </ContextMenuContent>
        </ContextMenuPositioner>
      </ContextMenuPortal>
    </ContextMenuRoot>
  );
};
