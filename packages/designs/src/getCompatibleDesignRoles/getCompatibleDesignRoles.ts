import { DesignRolesStore } from '../DesignRolesStore';
import {
  DesignRoleConfig,
  DesignRoleId,
  DesignType,
  LayoutType,
} from '../types';

/**
 * The insertion context to filter roles against.
 */
export interface DesignRoleContextFilter {
  /**
   * The type of the design being edited.
   */
  designType?: DesignType;

  /**
   * The type of the layout being edited.
   */
  layoutType?: LayoutType;

  /**
   * The role of the parent element the role would be inserted into.
   */
  parentRole?: DesignRoleId;
}

/**
 * Retrieves the registered design roles compatible with the given
 * insertion context. A role is compatible when every context axis it
 * restricts includes the corresponding filter value; filter axes
 * left unset do not exclude anything.
 *
 * @param filter - The insertion context to filter against.
 * @returns The compatible role configs.
 */
export function getCompatibleDesignRoles(
  filter: DesignRoleContextFilter,
): DesignRoleConfig[] {
  // Check every registered role against the filter
  return DesignRolesStore.getAllArray().filter((role) =>
    isCompatible(role, filter),
  );
}

/**
 * Checks a single role against the context filter.
 */
function isCompatible(
  role: DesignRoleConfig,
  filter: DesignRoleContextFilter,
): boolean {
  const { designTypes, layoutTypes, parentRoles } = role.context;

  // A restricted design type axis must include the filter's design type
  if (
    designTypes &&
    filter.designType &&
    !designTypes.includes(filter.designType)
  ) {
    return false;
  }

  // A restricted layout type axis must include the filter's layout type
  if (
    layoutTypes &&
    filter.layoutType &&
    !layoutTypes.includes(filter.layoutType)
  ) {
    return false;
  }

  // A restricted parent role axis must include the filter's parent role
  if (parentRoles && !parentRoles.includes(filter.parentRole ?? '')) {
    return false;
  }

  return true;
}
