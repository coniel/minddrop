import { DesignDateElement } from '../../DesignElements';
import { FlatDateElement } from '../../types';

export interface DesignStudioDateElementProps {
  element: FlatDateElement;
}

/**
 * Renders a date element in the design studio.
 * Delegates entirely to the common DesignDateElement.
 */
export const DesignStudioDateElement: React.FC<
  DesignStudioDateElementProps
> = ({ element }) => {
  return <DesignDateElement element={element} />;
};
