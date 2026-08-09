import {
  DesignStudioStore,
  getDesignElement,
  updateDesignElement,
  updateDesignProperty,
} from '../../DesignStudioStore';

/**
 * Sets an image from the placeholder-media directory as an
 * element's image value: the bound design property's placeholder
 * when the element is bound, the element's own content image
 * otherwise. Elements in property mode without a bound property
 * are switched to static mode.
 *
 * @param elementId - The ID of the element to set the image on.
 * @param fileName - The image file name.
 */
export async function setElementImage(
  elementId: string,
  fileName: string,
): Promise<void> {
  const element = getDesignElement(elementId);

  if (!element) {
    return;
  }

  // Bound elements receive the image as their design property's
  // placeholder
  if (!element.static && element.property) {
    const property = DesignStudioStore.getDesign()?.properties.find(
      (candidate) => candidate.name === element.property,
    );

    if (property) {
      await updateDesignProperty({ ...property, placeholder: fileName });

      return;
    }
  }

  // Set the image as the element's own content image, switching
  // unbound elements to static mode
  updateDesignElement(elementId, { content: fileName, static: true });
}
