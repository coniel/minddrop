import { DesignNumberElement } from '../../DesignElements';
import { FlatNumberElement } from '../../types';

export interface DesignStudioNumberElementProps {
  element: FlatNumberElement;
}

/**
 * Renders a number element in the design studio.
 * Delegates entirely to the common DesignNumberElement.
 */
export const DesignStudioNumberElement: React.FC<
  DesignStudioNumberElementProps
> = ({ element }) => {
  return <DesignNumberElement element={element} />;
};
