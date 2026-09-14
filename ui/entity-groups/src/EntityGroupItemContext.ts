import { createContext, useContext } from 'react';

export interface EntityGroupItemContextValue {
  /**
   * The ID of the group the item is listed in.
   */
  groupId: string;

  /**
   * The ID of the entity the item points to.
   */
  itemId: string;
}

const EntityGroupItemContext = createContext<EntityGroupItemContextValue>({
  groupId: '',
  itemId: '',
});

/**
 * Provides the group an item is listed in to the content rendered
 * inside it, which is what an action on the item acts within.
 */
export const EntityGroupItemProvider = EntityGroupItemContext.Provider;

/**
 * Returns the item surrounding the component, and the group listing
 * it.
 */
export function useEntityGroupItem(): EntityGroupItemContextValue {
  return useContext(EntityGroupItemContext);
}
