import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { render } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup } from '../../../test-utils';
import { ImageViewerElement } from '../ImageViewerElement.types';
import { ImageViewerElementConfig } from '../ImageViewerElementConfig';
import { ImageViewerElementRenderer } from './ImageViewerElementRenderer';

const { coverDesignElement } = DesignElementFixtures;

// An image viewer element mapped to the Scan property
const viewerElement: ImageViewerElement = {
  ...coverDesignElement,
  type: ImageViewerElementConfig.type,
  property: 'Scan',
};

// The schema holding the Scan property
const properties: PropertiesSchema = [{ type: 'image', name: 'Scan' }];

// The path of the entry's scanned picture
const scanPath = '/workspace/Database/Entry/scan.png';

/**
 * Renders the element with the given property values.
 *
 * @param element - The element to render.
 * @param values - The property values, keyed by property name.
 * @returns The rendered element's box.
 */
function renderViewer(element: ImageViewerElement, values: PropertyMap = {}) {
  // Render the element with the property values
  const { container } = render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <ImageViewerElementRenderer element={element} />
    </DesignPropertiesProvider>,
  );

  // Find the element's box
  return container.querySelector('.design-image-viewer-element')!;
}

describe('ImageViewerElementRenderer', () => {
  afterEach(cleanup);

  it('draws the mapped picture in the viewer', () => {
    const box = renderViewer(viewerElement, { Scan: scanPath });

    expect(box.querySelector('img')).not.toBeNull();
  });

  it('draws the placeholder when the property is empty', () => {
    const box = renderViewer(viewerElement);

    expect(box.querySelector('img')).toBeNull();
    expect(
      box.classList.contains('design-image-viewer-element-placeholder'),
    ).toBe(true);
  });
});
