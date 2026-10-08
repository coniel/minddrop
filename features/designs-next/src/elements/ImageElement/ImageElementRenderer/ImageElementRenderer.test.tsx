import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { render } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup } from '../../../test-utils';
import { ImageElement } from '../ImageElement.types';
import { ImageElementConfig } from '../ImageElementConfig';
import { ImageElementRenderer } from './ImageElementRenderer';

const { coverDesignElement } = DesignElementFixtures;

// An image element mapped to the Cover property
const imageElement: ImageElement = {
  ...coverDesignElement,
  type: ImageElementConfig.type,
  property: 'Cover',
};

// The schema holding the Cover property
const properties: PropertiesSchema = [{ type: 'image', name: 'Cover' }];

// The path of the entry's cover picture
const coverPath = '/workspace/Database/Entry/cover.png';

/**
 * Renders the element with the given property values.
 *
 * @param element - The element to render.
 * @param values - The property values, keyed by property name.
 * @returns The rendered element's box.
 */
function renderImage(element: ImageElement, values: PropertyMap = {}) {
  // Render the element with the property values
  const { container } = render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <ImageElementRenderer element={element} />
    </DesignPropertiesProvider>,
  );

  // Find the element's box
  return container.querySelector<HTMLElement>('.design-image-element')!;
}

describe('ImageElementRenderer', () => {
  afterEach(cleanup);

  it('draws the mapped picture', () => {
    const box = renderImage(imageElement, { Cover: coverPath });

    expect(box.querySelector('img')).not.toBeNull();
  });

  it('draws the placeholder when the property is empty', () => {
    const box = renderImage(imageElement);

    expect(box.querySelector('img')).toBeNull();
    expect(box.classList.contains('design-image-element-placeholder')).toBe(
      true,
    );
  });

  it('draws the placeholder when the element is unmapped', () => {
    const box = renderImage(
      { ...imageElement, property: undefined },
      { Cover: coverPath },
    );

    expect(box.querySelector('img')).toBeNull();
    expect(box.classList.contains('design-image-element-placeholder')).toBe(
      true,
    );
  });

  it('crops the picture to its block by default', () => {
    const box = renderImage(imageElement, { Cover: coverPath });

    expect(box.querySelector('img')).not.toBeNull();
    expect(box.classList.contains('design-image-element-cover')).toBe(true);
  });

  it('fits the whole picture inside its block when set to contain', () => {
    const box = renderImage(
      { ...imageElement, fit: 'contain' },
      { Cover: coverPath },
    );

    expect(box.classList.contains('design-image-element-contain')).toBe(true);
  });

  it('stretches the picture to its block when set to fill', () => {
    const box = renderImage(
      { ...imageElement, fit: 'fill' },
      { Cover: coverPath },
    );

    expect(box.classList.contains('design-image-element-fill')).toBe(true);
  });

  it('rounds the picture by the small radius by default', () => {
    const box = renderImage(imageElement, { Cover: coverPath });

    expect(box.style.borderRadius).toBe('var(--radius-sm)');
  });

  it('rounds the picture to its corner radius', () => {
    const box = renderImage(
      { ...imageElement, cornerRadius: 'md' },
      { Cover: coverPath },
    );

    expect(box.style.borderRadius).toBe('var(--radius-md)');
  });

  it('rounds the placeholder to its corner radius', () => {
    const box = renderImage({ ...imageElement, cornerRadius: 'md' });

    expect(box.style.borderRadius).toBe('var(--radius-md)');
  });
});
