import { DesignElement, isEmptyPropertyValue } from '@minddrop/designs';
import {
  useDesignProperties,
  useElementProperty,
} from './DesignPropertiesProvider';
import { useElementPlaceholder } from './useElementPlaceholder';

/**
 * Determines whether a design element should be hidden in the
 * current render. Only applies to property-bound leaf elements
 * during real entry rendering: when the bound property has no
 * value, the element's empty behavior decides whether to hide it
 * or show its placeholder (hiding when there is no placeholder).
 * Always returns false in the studio so elements stay visible
 * while editing.
 */
export function useElementHidden(element: DesignElement): boolean {
  const entryContext = useDesignProperties();
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);

  // Outside real entry rendering (studio/preview) elements are
  // never hidden so they remain visible and selectable
  if (!entryContext) {
    return false;
  }

  // Static, unbound, and container/root elements are not governed
  // by empty behavior
  if (element.static || !element.property || 'children' in element) {
    return false;
  }

  // A present value is always shown
  if (!isEmptyPropertyValue(property?.value)) {
    return false;
  }

  // No value: hide outright, or show the placeholder when there is
  // one, otherwise hide
  const behavior = element.emptyBehavior ?? 'hide';

  if (behavior === 'hide') {
    return true;
  }

  return !placeholder;
}
