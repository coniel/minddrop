import { createObjectStore } from '@minddrop/stores';
import { DesignRoleConfig } from './types';

export const DesignRolesStore = createObjectStore<DesignRoleConfig>(
  'Designs:DesignRoles',
  'id',
);

/**
 * Retrieves a registered design role by its ID.
 *
 * @param id - The ID of the role to retrieve.
 * @returns The role config or null if it isn't registered.
 */
export const useDesignRole = (id: string): DesignRoleConfig | null => {
  return DesignRolesStore.useItem(id);
};

/**
 * Retrieves all registered design roles.
 *
 * @returns An array of all registered role configs.
 */
export const useDesignRoles = (): DesignRoleConfig[] => {
  return DesignRolesStore.useAllItemsArray();
};
