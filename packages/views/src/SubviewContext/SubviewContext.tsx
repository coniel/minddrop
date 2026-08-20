import { createContext } from 'react';
import { SubviewDescriptor } from '../types';

export const SubviewContext = createContext<SubviewDescriptor | null>(null);

export interface SubviewProviderProps {
  /**
   * The entity the view currently shows within itself, or null when
   * it shows none.
   */
  subview: SubviewDescriptor | null;

  /**
   * The view content the subview belongs to.
   */
  children: React.ReactNode;
}

/**
 * Provides a view instance's current subview to the components
 * rendered inside it.
 */
export const SubviewProvider: React.FC<SubviewProviderProps> = ({
  subview,
  children,
}) => (
  <SubviewContext.Provider value={subview}>{children}</SubviewContext.Provider>
);
