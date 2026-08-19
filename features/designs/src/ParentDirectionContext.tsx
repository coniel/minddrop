import { createContext, useContext } from 'react';
import { ContainerDirection } from '@minddrop/designs';

/**
 * The direction the containing element stacks its children in.
 * Layouts stack in a column unless a container says otherwise.
 */
const ParentDirectionContext = createContext<ContainerDirection>('column');

export const ParentDirectionProvider = ParentDirectionContext.Provider;

/**
 * Returns the direction the containing element stacks its children
 * in, which decides how an element fills the space it is given.
 */
export function useParentDirection(): ContainerDirection {
  return useContext(ParentDirectionContext);
}
