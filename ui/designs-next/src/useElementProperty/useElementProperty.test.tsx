import { afterEach, describe, expect, it } from 'vitest';
import { DesignElement } from '@minddrop/designs-next';
import { titleDesignElement } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '../DesignPropertiesProvider';
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

/**
 * Renders the type and value the hook resolves for an element.
 */
const PropertyProbe: React.FC<{ element: DesignElement }> = ({ element }) => {
  const property = useElementProperty(element);

  return (
    <div data-testid="property">
      {property ? `${property.schema.type}:${property.value}` : 'none'}
    </div>
  );
};

/**
 * Renders the probe on an element mapped to the given property.
 *
 * @param property - The property the element maps to.
 */
function renderProbe(property?: string) {
  const element: DesignElement = { ...titleDesignElement, property };

  render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <PropertyProbe element={element} />
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
