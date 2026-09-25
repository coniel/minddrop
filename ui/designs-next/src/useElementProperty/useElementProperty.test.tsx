import { afterEach, describe, expect, it } from 'vitest';
import { DesignElement } from '@minddrop/designs-next';
import { titleDesignElement } from '@minddrop/designs-next/test-utils';
import {
  PropertiesSchema,
  PropertyMap,
  PropertyValue,
} from '@minddrop/properties';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import {
  DesignPropertiesProvider,
  DesignPropertiesProviderProps,
} from '../DesignPropertiesProvider';
import { cleanup } from '../test-utils';
import { useElementProperty } from './useElementProperty';

const properties: PropertiesSchema = [
  { type: 'content', name: 'Notes' },
  { type: 'text', name: 'Summary' },
];

const values: PropertyMap = {
  Notes: '# The entry document',
  Summary: null,
};

interface ProbeProps {
  /**
   * The element to resolve the property of.
   */
  element: DesignElement;
}

/**
 * Renders the type and value the hook resolves for an element.
 */
const PropertyProbe: React.FC<ProbeProps> = ({ element }) => {
  const property = useElementProperty(element);

  return (
    <div data-testid="property">
      {property ? `${property.schema.type}:${property.value}` : 'none'}
    </div>
  );
};

/**
 * Renders an update button for the element's property and the
 * validation of another value. Renders 'read only' when the property
 * cannot be updated.
 */
const EditProbe: React.FC<ProbeProps> = ({ element }) => {
  const property = useElementProperty(element);

  if (!property?.updateValue) {
    return <div data-testid="edit">read only</div>;
  }

  return (
    <div data-testid="edit">
      <button onClick={() => property.updateValue?.('Edited')}>update</button>
      {property.validateValue?.('Taken')}
    </div>
  );
};

/**
 * Renders the probe on an element mapped to the given property.
 *
 * @param property - The property the element maps to.
 * @param callbacks - The provider's update and validation callbacks.
 */
function renderProbe(
  property?: string,
  callbacks?: Pick<
    DesignPropertiesProviderProps,
    'onValueChange' | 'validateValue'
  >,
) {
  // Map the element to the property
  const element: DesignElement = { ...titleDesignElement, property };

  // Render the probes inside a provider
  render(
    <DesignPropertiesProvider
      properties={properties}
      values={values}
      {...callbacks}
    >
      <PropertyProbe element={element} />
      <EditProbe element={element} />
    </DesignPropertiesProvider>,
  );
}

describe('useElementProperty', () => {
  afterEach(cleanup);

  it("resolves the mapped property's schema and value", () => {
    renderProbe('Notes');

    // Resolved unformatted. A content property has no text form,
    // so formatting its value would return nothing.
    expect(screen.getByTestId('property').textContent).toBe(
      'content:# The entry document',
    );
  });

  it('updates the mapped property through the provider callback', () => {
    // The change the provider is handed
    let change: [string, PropertyValue] | null = null;

    renderProbe('Notes', {
      onValueChange: (name, value) => {
        change = [name, value];
      },
    });

    fireEvent.click(screen.getByText('update'));

    expect(change).toEqual(['Notes', 'Edited']);
  });

  it('validates a value through the provider callback', () => {
    renderProbe('Notes', {
      onValueChange: () => {},
      validateValue: (name, value) => `${name} is already ${value}`,
    });

    expect(screen.getByText('Notes is already Taken')).toBeInTheDocument();
  });

  it('resolves no update callback without a provider callback', () => {
    renderProbe('Notes');

    expect(screen.getByText('read only')).toBeInTheDocument();
  });

  it('resolves a null value when the property has none', () => {
    renderProbe('Summary');

    expect(screen.getByTestId('property').textContent).toBe('text:null');
  });

  it('resolves nothing for an unmapped element', () => {
    renderProbe();

    expect(screen.getByTestId('property').textContent).toBe('none');
  });

  it('resolves nothing for a property which is no longer provided', () => {
    renderProbe('Removed');

    expect(screen.getByTestId('property').textContent).toBe('none');
  });
});
