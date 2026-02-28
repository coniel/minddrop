import { createTextCssStyle } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { FlatTextElement } from '../../types';

export interface DesignStudioFormattedTextElementProps {
  element: FlatTextElement;
}

export const DesignStudioFormattedTextElement: React.FC<
  DesignStudioFormattedTextElementProps
> = ({ element }) => {
  const { t } = useTranslation();

  const placeholder =
    element.placeholder || t('design-studio.elements.text-placeholder');

  return (
    <div style={createTextCssStyle(element.style)}>
      {placeholder}
    </div>
  );
};
