import { FlatNumberElement } from '../../types';
import { NumberDesignElement } from './NumberDesignElement';

export interface NumberStudioDesignElementProps {
  /**
   * The number element to render in the studio.
   */
  element: FlatNumberElement;
}

/**
 * Renders a number element in the design studio.
 * Delegates entirely to the common NumberDesignElement.
 */
export const NumberStudioDesignElement: React.FC<
  NumberStudioDesignElementProps
> = ({ element }) => {
  return <NumberDesignElement element={element} />;
};
