import { DesignElementProps } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { useElementProperty } from '@minddrop/ui-designs-next';
import { ToggleElement } from '../ToggleElement.types';
import {
  DefaultCheckedIcon,
  DefaultToggleElementSize,
  DefaultToggleStyle,
  DefaultUncheckedIcon,
} from '../constants';
import { ToggleIndicator } from './ToggleIndicator';
import './ToggleElementRenderer.css';

/**
 * Renders a toggle element as a checkbox, a switch or an icon. It is
 * checked while the toggle property it maps to is true, and while it
 * maps to none.
 */
export const ToggleElementRenderer: React.FC<
  DesignElementProps<ToggleElement>
> = ({ element }) => {
  const { t } = useTranslation();

  // Read the property the element maps to
  const property = useElementProperty(element);

  // Resolve whether the toggle is checked. It is when the element
  // is unmapped.
  const checked = property ? property.value === true : true;

  // Resolve the style and the size the state is drawn at
  const style = element.style ?? DefaultToggleStyle;
  const size = element.size ?? DefaultToggleElementSize;

  // Name the toggle after the property it maps to. Falls back to
  // the element's own name.
  const label = property?.schema.name ?? t('designsNext.elements.toggle.label');

  return (
    <div className={`design-toggle-element design-toggle-element-${style}`}>
      <ToggleIndicator
        style={style}
        size={size}
        checked={checked}
        label={label}
        checkedIcon={element.checkedIcon ?? DefaultCheckedIcon}
        uncheckedIcon={element.uncheckedIcon ?? DefaultUncheckedIcon}
      />
    </div>
  );
};
