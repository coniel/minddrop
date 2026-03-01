import { DesignUrlElement } from '@minddrop/feature-designs';
import { FlatUrlElement } from '../../types';

const DEFAULT_URL_PLACEHOLDER = 'https://www.example.com/page';

export interface DesignStudioUrlElementProps {
  element: FlatUrlElement;
}

/**
 * Renders a URL element in the design studio.
 * Wraps DesignUrlElement with a hardcoded fallback placeholder.
 */
export const DesignStudioUrlElement: React.FC<DesignStudioUrlElementProps> = ({
  element,
}) => {
  // Default the placeholder when not explicitly set
  const elementWithPlaceholder = element.placeholder
    ? element
    : { ...element, placeholder: DEFAULT_URL_PLACEHOLDER };

  return <DesignUrlElement element={elementWithPlaceholder} />;
};
