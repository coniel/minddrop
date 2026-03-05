import { useTranslation } from '@minddrop/i18n';
import { FlatFormattedTextElement } from '../../types';
import { FormattedTextDesignElement } from './FormattedTextDesignElement';

export interface FormattedTextStudioDesignElementProps {
  element: FlatFormattedTextElement;
}

/**
 * Renders a formatted text element in the design studio.
 * Wraps FormattedTextDesignElement with an i18n fallback placeholder.
 */
export const FormattedTextStudioDesignElement: React.FC<
  FormattedTextStudioDesignElementProps
> = ({ element }) => {
  const { t } = useTranslation();

  // Default the placeholder to the i18n string when not explicitly set
  const elementWithPlaceholder = element.placeholder
    ? element
    : { ...element, placeholder: t('design-studio.elements.text-placeholder') };

  return <FormattedTextDesignElement element={elementWithPlaceholder} />;
};
