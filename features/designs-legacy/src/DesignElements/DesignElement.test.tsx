import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs-legacy/test-utils';
import {
  PropertiesSchema,
  PropertyMap,
  PropertyValue,
} from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import {
  DesignPropertiesProvider,
  DesignPropertySchemasProvider,
} from '../DesignPropertiesProvider';
import { cleanup, element_text_1, setup } from '../test-utils';
import { DesignElement } from './DesignElement';
import { DesignPreviewProvider } from './DesignPreviewContext';

const { designProperties } = DesignFixtures;

// A text element bound to the 'Title' design property
const boundElement = { ...element_text_1, property: 'Title' };

// Maps the bound element to the 'Title' database property
const propertyMap = { [element_text_1.id]: 'Title' };

// The database property schema resolved for the element's value
const properties: PropertiesSchema = [{ type: 'text', name: 'Title' }];

interface RenderOptions {
  /**
   * The value of the bound property. Omitted for an entry with no
   * value, matching a real absent database value.
   */
  value?: PropertyValue;

  /**
   * The bound design property's placeholder.
   */
  placeholder?: string;

  /**
   * The element's empty behavior.
   */
  emptyBehavior?: 'hide' | 'placeholder';
}

// Renders the bound element inside real entry-rendering providers
function renderElement({ value, placeholder, emptyBehavior }: RenderOptions) {
  const element = { ...boundElement, emptyBehavior };
  const designSchemas: PropertiesSchema = [
    { ...designProperties[0], name: 'Title', placeholder },
  ];

  // Omit the key entirely when there is no value
  const propertyValues: PropertyMap =
    value === undefined ? {} : { Title: value };

  return render(
    <DesignPropertySchemasProvider properties={designSchemas}>
      <DesignPropertiesProvider
        properties={properties}
        propertyValues={propertyValues}
        propertyMap={propertyMap}
      >
        <DesignElement element={element} />
      </DesignPropertiesProvider>
    </DesignPropertySchemasProvider>,
  );
}

// Whether the element rendered its wrapper node
function elementRendered(container: HTMLElement): boolean {
  return !!container.querySelector(`[data-element-id="${element_text_1.id}"]`);
}

describe('<DesignElement />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the value when the bound property has one', () => {
    const { container } = renderElement({ value: 'Hello', placeholder: 'Ph' });

    expect(elementRendered(container)).toBe(true);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('hides the element when empty and behavior is the default (hide)', () => {
    const { container } = renderElement({ placeholder: 'Ph' });

    expect(elementRendered(container)).toBe(false);
  });

  it('hides the element when empty and behavior is hide', () => {
    const { container } = renderElement({
      placeholder: 'Ph',
      emptyBehavior: 'hide',
    });

    expect(elementRendered(container)).toBe(false);
  });

  it('shows the placeholder when empty and behavior is placeholder', () => {
    const { container } = renderElement({
      placeholder: 'Ph',
      emptyBehavior: 'placeholder',
    });

    expect(elementRendered(container)).toBe(true);
    expect(screen.getByText('Ph')).toBeInTheDocument();
  });

  it('hides the element when behavior is placeholder but there is no placeholder', () => {
    const { container } = renderElement({
      placeholder: '',
      emptyBehavior: 'placeholder',
    });

    expect(elementRendered(container)).toBe(false);
  });

  it('shows the placeholder in preview mode even when empty and behavior is hide', () => {
    const element = { ...boundElement, emptyBehavior: 'hide' as const };
    const designSchemas: PropertiesSchema = [
      { ...designProperties[0], name: 'Title', placeholder: 'Ph' },
    ];

    const { container } = render(
      <DesignPreviewProvider value>
        <DesignPropertySchemasProvider properties={designSchemas}>
          <DesignPropertiesProvider
            properties={properties}
            propertyValues={{}}
            propertyMap={propertyMap}
          >
            <DesignElement element={element} />
          </DesignPropertiesProvider>
        </DesignPropertySchemasProvider>
      </DesignPreviewProvider>,
    );

    expect(elementRendered(container)).toBe(true);
    expect(screen.getByText('Ph')).toBeInTheDocument();
  });
});
