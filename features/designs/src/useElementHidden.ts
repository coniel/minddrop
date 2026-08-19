import {
  DesignElement,
  getElementConfig,
  isEmptyPropertyValue,
} from '@minddrop/designs';
import { useDesignPreview } from './DesignElements';
import {
  useDesignProperties,
  useElementProperty,
} from './DesignPropertiesProvider';

/**
 * Determines whether a design element should be hidden in the
 * current render. Applies only to property-bound leaf elements
 * during real entry rendering, and only to element types whose
 * empty behaviour is 'hide': when the bound property has no value,
 * the element is left out of the entry rather than showing an empty
 * slot. Always returns false in the studio so elements stay visible
 * while editing.
 */
export function useElementHidden(element: DesignElement): boolean {
  const isPreview = useDesignPreview();
  const entryContext = useDesignProperties();
  const property = useElementProperty(element.id);

  // Outside real entry rendering (studio/preview) elements are
  // never hidden so they remain visible and selectable. Previews
  // always show the design as authored, even when nested in an
  // ambient entry context.
  if (isPreview || !entryContext) {
    return false;
  }

  // Static, unbound, and container/root elements are not governed
  // by empty behaviour
  if (element.static || !element.property || 'children' in element) {
    return false;
  }

  // Element types whose empty state is expected always render, the
  // editor being the clearest case: an empty editor is where
  // writing starts
  if (getElementConfig(element.type).emptyBehavior !== 'hide') {
    return false;
  }

  // A present value is always shown
  if (!isEmptyPropertyValue(property?.value)) {
    return false;
  }

  return true;
}
