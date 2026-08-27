import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { i18n } from '@minddrop/i18n';
import { cleanup as cleanupRender, render } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '../../../DesignPropertiesProvider';
import { cleanup, setup } from '../../../test-utils';
import { PropertyDesignElement } from '../PropertyDesignElement';

const { element_property_text_1, element_property_url_1 } = DesignFixtures;

describe('<PropertyChrome />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('renders the value alone without chrome styles', () => {
    const { container } = render(
      <PropertyDesignElement element={element_property_text_1} />,
    );

    expect(container.querySelector('.designs-property-chrome')).toBeNull();
  });

  it('renders the bound property name as the label', () => {
    const { container } = render(
      <PropertyDesignElement
        element={{
          ...element_property_text_1,
          property: 'Author',
          style: { label: { variant: 'side' } },
        }}
      />,
    );

    // The side variant renders the label inside the value row
    const label = container.querySelector(
      '.designs-property-chrome-row .designs-property-chrome-label',
    );

    expect(label?.textContent).toBe('Author');
  });

  it('falls back to the property type label while unbound', () => {
    const { container } = render(
      <PropertyDesignElement
        element={{
          ...element_property_text_1,
          style: { label: {} },
        }}
      />,
    );

    const label = container.querySelector('.designs-property-chrome-label');

    expect(label?.textContent).toBe(i18n.t('properties.text.name'));
  });

  it('places above variants in the group above the value', () => {
    const { container } = render(
      <PropertyDesignElement
        element={{
          ...element_property_text_1,
          property: 'Author',
          style: {
            label: { variant: 'above' },
            icon: { variant: 'above' },
          },
        }}
      />,
    );

    // Both pieces sit together in the group above the value row
    const group = container.querySelector('.designs-property-chrome-group');

    expect(
      group?.querySelector('.designs-property-chrome-icon'),
    ).not.toBeNull();
    expect(
      group?.querySelector('.designs-property-chrome-label'),
    ).not.toBeNull();
  });

  it('marks the value row for the spread variant', () => {
    const { container } = render(
      <PropertyDesignElement
        element={{
          ...element_property_text_1,
          property: 'Author',
          style: { label: { variant: 'spread' } },
        }}
      />,
    );

    // The spread label sits in the row, which takes the spread
    // modifier pushing the value to the far side
    const row = container.querySelector('.designs-property-chrome-row-spread');

    expect(row?.querySelector('.designs-property-chrome-label')).not.toBeNull();
  });

  it('renders the property type icon while the property has none', () => {
    const { container } = render(
      <PropertyDesignElement
        element={{
          ...element_property_text_1,
          property: 'Author',
          style: { icon: {} },
        }}
      />,
    );

    // The fallback renders the type's icon glyph
    expect(
      container.querySelector('.designs-property-chrome-icon'),
    ).not.toBeNull();
  });

  it('hides unbound chrome during entry rendering', () => {
    const { container } = render(
      <DesignPropertiesProvider
        properties={[]}
        propertyValues={{}}
        propertyMap={{}}
      >
        <PropertyDesignElement
          element={{
            ...element_property_text_1,
            style: { label: {}, icon: {} },
          }}
        />
      </DesignPropertiesProvider>,
    );

    // A stand-in label or icon would read as entry content
    expect(
      container.querySelector('.designs-property-chrome-label'),
    ).toBeNull();
    expect(container.querySelector('.designs-property-chrome-icon')).toBeNull();
  });

  it('renders no chrome for variants outside the value-like categories', () => {
    const { container } = render(
      <PropertyDesignElement
        element={{
          ...element_property_url_1,
          variant: 'webview',
          style: { label: {} },
        }}
      />,
    );

    expect(container.querySelector('.designs-property-chrome')).toBeNull();
  });

  it('moves the element margins onto the chrome wrapper', () => {
    const { container } = render(
      <PropertyDesignElement
        element={{
          ...element_property_text_1,
          property: 'Author',
          style: { label: { variant: 'side' }, marginTop: '4' },
        }}
      />,
    );

    const wrapper = container.querySelector<HTMLElement>(
      '.designs-property-chrome',
    );
    const value = container.querySelector<HTMLElement>(
      '.designs-property-chrome-row > :last-child',
    );

    // The wrapper carries the margin so it surrounds the chrome
    expect(wrapper?.style.marginTop).toBe('var(--space-4)');
    expect(value?.style.marginTop).toBe('');
  });
});
