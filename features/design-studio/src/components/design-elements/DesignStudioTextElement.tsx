import { createTextCssStyle } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { FlatTextElement } from '../../types';

export interface DesignStudioTextElementProps {
  element: FlatTextElement;
}

export const DesignStudioTextElement: React.FC<
  DesignStudioTextElementProps
> = ({ element }) => {
  const { t } = useTranslation();

  const placeholder =
    element.placeholder || t('design-studio.elements.text-placeholder');

  return (
    <span
      style={createTextCssStyle(element.style)}
      data-placeholder={placeholder}
    >
      {placeholder}
    </span>
  );
};
