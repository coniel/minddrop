import { FlatBadgesElement } from '../../types';
import { BadgesDesignElement } from './BadgesDesignElement';

export interface BadgesStudioDesignElementProps {
  /**
   * The badges element to render in the studio.
   */
  element: FlatBadgesElement;
}

/**
 * Renders a badges element in the design studio.
 * Delegates entirely to the common BadgesDesignElement.
 */
export const BadgesStudioDesignElement: React.FC<
  BadgesStudioDesignElementProps
> = ({ element }) => {
  return <BadgesDesignElement element={element} />;
};
