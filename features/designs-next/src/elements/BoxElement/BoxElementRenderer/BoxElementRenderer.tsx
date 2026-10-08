import {
  DesignElementProps,
  DesignElementSettings,
  Designs,
} from '@minddrop/designs-next';
import { resolveElementStyle } from '@minddrop/ui-designs-next';
import { BoxElement } from '../BoxElement.types';
import './BoxElementRenderer.css';

// The surface a box is drawn on without settings of its own
const BoxDefaults: DesignElementSettings = {
  background: 'subtle',
  cornerRadius: Designs.constants.DefaultCornerRadius,
};

/**
 * Renders the decorative box element as a surface block styled by
 * its background settings.
 */
export const BoxElementRenderer: React.FC<DesignElementProps<BoxElement>> = ({
  element,
}) => {
  // Resolve the background settings into the styles they render as
  const style = resolveElementStyle(element, BoxDefaults);

  return <div className="design-box-element" style={style} />;
};
