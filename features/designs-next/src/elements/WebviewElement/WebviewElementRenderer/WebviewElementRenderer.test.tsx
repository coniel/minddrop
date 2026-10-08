import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { toEmbedUrl } from '@minddrop/utils';
import { cleanup } from '../../../test-utils';
import { WebviewElement } from '../WebviewElement.types';
import { WebviewElementConfig } from '../WebviewElementConfig';
import { WebviewElementRenderer } from './WebviewElementRenderer';

const { bodyDesignElement } = DesignElementFixtures;

// A webview element mapped to the Website property
const webviewElement: WebviewElement = {
  ...bodyDesignElement,
  type: WebviewElementConfig.type,
  property: 'Website',
};

// The schema with the Website property
const properties: PropertiesSchema = [{ type: 'url', name: 'Website' }];

// The Website property's value
const website = 'https://example.com/page';

// A link with an embeddable form
const youtubeLink = 'https://www.youtube.com/watch?v=abc-123';

// The frame's title
const frameTitle = 'Web page';

/**
 * Renders the element with the given property values.
 *
 * @param element - The element to render.
 * @param values - The property values, keyed by property name.
 * @returns The rendered element's box.
 */
function renderWebview(element: WebviewElement, values: PropertyMap = {}) {
  // Render the element with the property values
  const { container } = render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <WebviewElementRenderer element={element} />
    </DesignPropertiesProvider>,
  );

  // Find the element's box
  return container.querySelector<HTMLElement>('.design-webview-element')!;
}

describe('WebviewElementRenderer', () => {
  afterEach(cleanup);

  it("embeds the mapped address's page", () => {
    renderWebview(webviewElement, { Website: website });

    expect(screen.getByTitle(frameTitle)).toHaveAttribute('src', website);
  });

  it('embeds a known link through its embeddable form', () => {
    renderWebview(webviewElement, { Website: youtubeLink });

    expect(screen.getByTitle(frameTitle)).toHaveAttribute(
      'src',
      toEmbedUrl(youtubeLink),
    );
  });

  it('renders the placeholder when the element is unmapped', () => {
    const box = renderWebview(
      { ...webviewElement, property: undefined },
      { Website: website },
    );

    expect(screen.queryByTitle(frameTitle)).toBeNull();
    expect(box.classList.contains('design-webview-element-placeholder')).toBe(
      true,
    );
  });

  it('renders the placeholder when the property has no value', () => {
    const box = renderWebview(webviewElement);

    expect(screen.queryByTitle(frameTitle)).toBeNull();
    expect(box.classList.contains('design-webview-element-placeholder')).toBe(
      true,
    );
  });

  it('rounds the frame by the small radius by default', () => {
    const box = renderWebview(webviewElement, { Website: website });

    expect(box.style.borderRadius).toBe('var(--radius-sm)');
  });

  it('rounds the frame to its corner radius', () => {
    const box = renderWebview(
      { ...webviewElement, cornerRadius: 'lg' },
      { Website: website },
    );

    expect(box.style.borderRadius).toBe('var(--radius-lg)');
  });
});
