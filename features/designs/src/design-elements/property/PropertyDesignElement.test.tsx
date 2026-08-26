import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyElement } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import { DesignPreviewProvider } from '../../DesignElements';
import { cleanup, setup } from '../../test-utils';
import { PropertyDesignElement } from './PropertyDesignElement';

const {
  element_property_text_1,
  element_property_number_1,
  element_property_select_1,
  element_property_url_1,
} = DesignFixtures;

describe('<PropertyDesignElement />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('renders through the selected variant renderer', () => {
    // An unbound text property element falls back to its property
    // element label as its placeholder
    render(<PropertyDesignElement element={element_property_text_1} />);

    screen.getByText('properties.text.name');
  });

  it('dispatches the renderer per property type', () => {
    render(<PropertyDesignElement element={element_property_number_1} />);

    // The number renderer displays the non-numeric placeholder as
    // plain text
    screen.getByText('properties.number.name');
  });

  it('swaps the renderer with the selected variant', () => {
    // The badges default renders the placeholder as chips
    const { container: badges } = render(
      <PropertyDesignElement element={element_property_select_1} />,
    );

    expect(badges.querySelector('.designs-badges-element')).not.toBeNull();

    cleanupRender();

    // The plain text variant renders the same value as a line of
    // text instead
    const { container: text } = render(
      <PropertyDesignElement
        element={{ ...element_property_select_1, variant: 'text' }}
      />,
    );

    expect(text.querySelector('.designs-badges-element')).toBeNull();
    screen.getByText('properties.select.name');
  });

  it('renders an embed variant through its own renderer', () => {
    render(
      <PropertyDesignElement
        element={{ ...element_property_url_1, variant: 'webview' }}
      />,
    );

    // With no URL bound the webview renders its placeholder preview
    screen.getByText('designsStudio.webview.placeholder');
  });

  it('renders the clickable link variant as an anchor to the address', () => {
    // An unbound element falls back to its property element label,
    // which stands in for the address a bound one would carry
    const { container } = render(
      <PropertyDesignElement
        element={{ ...element_property_url_1, variant: 'link' }}
      />,
    );

    const link = container.querySelector('a.designs-link-element');

    expect(link?.getAttribute('href')).toBe('URL');
  });

  it('renders the link without a destination inside a preview', () => {
    // The studio renders the design rather than an entry, where
    // following a link would take the designer out of their layout
    const { container } = render(
      <DesignPreviewProvider value>
        <PropertyDesignElement
          element={{ ...element_property_url_1, variant: 'link' }}
        />
      </DesignPreviewProvider>,
    );

    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelector('span.designs-link-element')).not.toBeNull();
  });

  it('renders nothing for property types without a config', () => {
    const element = {
      ...element_property_text_1,
      propertyType: 'toggle',
    } as unknown as PropertyElement;

    const { container } = render(<PropertyDesignElement element={element} />);

    expect(container.firstChild).toBeNull();
  });
});
