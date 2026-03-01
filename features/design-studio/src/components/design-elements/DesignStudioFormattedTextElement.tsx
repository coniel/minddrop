import { DesignFormattedTextElement } from '@minddrop/feature-designs';
import { useTranslation } from '@minddrop/i18n';
import { FlatFormattedTextElement } from '../../types';

export interface DesignStudioFormattedTextElementProps {
  element: FlatFormattedTextElement;
}

/**
 * Renders a formatted text element in the design studio.
 * Wraps DesignFormattedTextElement with an i18n fallback placeholder.
 */
export const DesignStudioFormattedTextElement: React.FC<
  DesignStudioFormattedTextElementProps
> = ({ element }) => {
  const { t } = useTranslation();

  // Default the placeholder to the i18n string when not explicitly set
  const elementWithPlaceholder = element.placeholder
    ? element
    : { ...element, placeholder: t('design-studio.elements.text-placeholder') };

  return <DesignFormattedTextElement element={elementWithPlaceholder} />;
};
