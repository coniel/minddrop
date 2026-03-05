import { FlatUrlElement } from '../../types';
import { UrlDesignElement } from './UrlDesignElement';

const DEFAULT_URL_PLACEHOLDER = 'https://www.example.com/page';

export interface UrlStudioDesignElementProps {
  element: FlatUrlElement;
}

/**
 * Renders a URL element in the design studio.
 * Wraps UrlDesignElement with a hardcoded fallback placeholder.
 */
export const UrlStudioDesignElement: React.FC<UrlStudioDesignElementProps> = ({
  element,
}) => {
  // Default the placeholder when not explicitly set
  const elementWithPlaceholder = element.placeholder
    ? element
    : { ...element, placeholder: DEFAULT_URL_PLACEHOLDER };

  return <UrlDesignElement element={elementWithPlaceholder} />;
};
