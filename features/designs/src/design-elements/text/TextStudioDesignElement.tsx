import { useTranslation } from '@minddrop/i18n';
import { FlatTextElement } from '../../types';
import { TextDesignElement } from './TextDesignElement';

export interface TextStudioDesignElementProps {
  /**
   * The text element to render in the studio.
   */
  element: FlatTextElement;
}

/**
 * Renders a text element in the design studio.
 * Wraps TextDesignElement with an i18n fallback placeholder.
 */
export const TextStudioDesignElement: React.FC<
  TextStudioDesignElementProps
> = ({ element }) => {
  const { t } = useTranslation();

  // Default the placeholder to the i18n string when not explicitly set
  const elementWithPlaceholder = element.placeholder
    ? element
    : { ...element, placeholder: t('design-studio.elements.text-placeholder') };

  return <TextDesignElement element={elementWithPlaceholder} />;
};
