import { DesignRoleConfig } from '@minddrop/designs';
import { useDraggable } from '@minddrop/selection';
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
 * inserts an element playing the role, auto-bound to a compatible
 * design property.
 */
export const RolePaletteItem: React.FC<RolePaletteItemProps> = ({ role }) => {
  const { draggableProps } = useDraggable({
    id: `role-${role.id}`,
    type: DesignRolesDataKey,
    data: { roleId: role.id },
  });

  return (
    <PaletteItem
      icon={role.icon}
      label={role.label}
      compatiblePropertyTypes={role.bindsPropertyTypes}
      draggableProps={draggableProps}
    />
  );
};
