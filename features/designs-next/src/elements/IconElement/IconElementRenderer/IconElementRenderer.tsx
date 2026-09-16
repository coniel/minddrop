import { DesignElementProps } from '@minddrop/designs-next';
import {
  resolveElementStyle,
  useElementProperty,
} from '@minddrop/ui-designs-next';
import { ContentIcon } from '@minddrop/ui-primitives';
import { resolveElementIcon } from '../../../utils';
import { IconElement } from '../IconElement.types';
import './IconElementRenderer.css';

/**
 * Renders an icon element as the icon of the property it maps to,
 * falling back to the icon picked on it.
 */
export const IconElementRenderer: React.FC<DesignElementProps<IconElement>> = ({
  element,
}) => {
  // Read the property the element maps to
  const property = useElementProperty(element);
  // Resolve the element's settings into the styles they render as
  const style = resolveElementStyle(element);
  // Resolve the icon the element draws
  const icon = resolveElementIcon(element, property);

  if (!icon) {
    return null;
  }

  return (
    <div className="design-icon-element" style={style}>
      <ContentIcon icon={icon} />
    </div>
  );
};
