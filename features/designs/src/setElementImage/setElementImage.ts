import { isPropertyElement } from '@minddrop/designs';
import { DesignStudioStore } from '../DesignStudioStore';

/**
 * Sets an image from the owner's media directory as an element's
 * image value: the bound design property's placeholder
 * when the element is bound, the element's own content image
 * otherwise. Elements in property mode without a bound property
 * are switched to static mode. Property elements render bound
 * values only, so an unbound one takes no image.
 *
 * @param studio - The design studio store instance.
 * @param elementId - The ID of the element to set the image on.
 * @param fileName - The image file name.
 */
export async function setElementImage(
  studio: DesignStudioStore,
  elementId: string,
  fileName: string,
): Promise<void> {
  const element = studio.getDesignElement(elementId);

  if (!element) {
    return;
  }

  // Bound elements receive the image as their design property's
  // placeholder
  if (!element.static && element.property) {
    const property = studio.getDesignProperty(element.property);

    if (property) {
      await studio.updateDesignProperty({ ...property, placeholder: fileName });

      return;
    }
  }

  // Property elements have no static content to fall back on
  if (isPropertyElement(element)) {
    return;
  }

  // Set the image as the element's own content image, switching
  // unbound elements to static mode
  studio.updateDesignElement(elementId, { content: fileName, static: true });
}
