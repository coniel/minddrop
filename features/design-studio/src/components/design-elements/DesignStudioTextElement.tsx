import { DesignTextElement } from '@minddrop/feature-designs';
import { useTranslation } from '@minddrop/i18n';
import { FlatTextElement } from '../../types';

export interface DesignStudioTextElementProps {
  element: FlatTextElement;
}

/**
 * Renders a text element in the design studio.
 * Wraps DesignTextElement with an i18n fallback placeholder.
 */
export const DesignStudioTextElement: React.FC<
  DesignStudioTextElementProps
> = ({ element }) => {
  const { t } = useTranslation();

  // Default the placeholder to the i18n string when not explicitly set
  const elementWithPlaceholder = element.placeholder
    ? element
    : { ...element, placeholder: t('design-studio.elements.text-placeholder') };

  return <DesignTextElement element={elementWithPlaceholder} />;
};
