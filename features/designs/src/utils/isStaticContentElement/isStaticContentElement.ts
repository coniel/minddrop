import { DesignElement, getElementConfig } from '@minddrop/designs';
import { FlatDesignElement } from '../../types';

/**
 * Checks whether an element displays static content of its own
 * rather than a bound property. Element types which are always
 * property bound are never static, whatever the element carries,
 * so a stale static flag cannot strand an element with neither a
 * binding nor a content input.
 *
 * @param element - The element to check.
 * @returns Whether the element displays static content.
 */
export function isStaticContentElement(
  element: DesignElement | FlatDesignElement,
): boolean {
  // Nothing to display statically unless the type allows it
  if (!getElementConfig(element.type).supportsStaticContent) {
    return false;
  }

  return Boolean(element.static);
}
