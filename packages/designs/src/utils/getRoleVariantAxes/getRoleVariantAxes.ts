import {
  DesignRoleConfig,
  DesignRoleVariantAxis,
  LayoutType,
} from '../../types';

/**
 * Returns the role's variant axes offered in the given layout
 * type. Axes without a layout type restriction are offered
 * everywhere; without a layout type to check against, no axis is
 * excluded.
 *
 * @param role - The role whose axes to filter.
 * @param layoutType - The type of the layout being edited.
 * @returns The applicable variant axes.
 */
export function getRoleVariantAxes(
  role: DesignRoleConfig,
  layoutType?: LayoutType,
): DesignRoleVariantAxis[] {
  // Keep each axis unless it restricts itself away from the layout type
  return (role.variants ?? []).filter(
    (axis) =>
      !axis.layoutTypes || !layoutType || axis.layoutTypes.includes(layoutType),
  );
}
