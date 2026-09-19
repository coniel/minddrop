import { useMemo } from 'react';
import { DesignRoleConfig } from '@minddrop/designs';
import { DragAndDrop } from '@minddrop/drag-and-drop';
import { PaletteItem } from '../PaletteItem';
import { DesignRolesDataKey } from '../constants';

export interface RolePaletteItemProps {
  /**
   * The design role the item inserts.
   */
  role: DesignRoleConfig;
}

/**
 * Renders a draggable palette item for a design role. Dropping it
 * inserts an element playing the role.
 */
export const RolePaletteItem: React.FC<RolePaletteItemProps> = ({ role }) => {
  // Build the drag data for the role
  const data = useMemo(
    () => ({ [DesignRolesDataKey]: [{ roleId: role.id }] }),
    [role.id],
  );
  // Register the item as draggable
  const { draggableProps } = DragAndDrop.useDraggable({
    id: `role-${role.id}`,
    type: DesignRolesDataKey,
    data,
  });

  return (
    <PaletteItem
      icon={role.icon}
      label={role.label}
      draggableProps={draggableProps}
    />
  );
};
