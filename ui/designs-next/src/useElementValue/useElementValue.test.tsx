import { afterEach, describe, expect, it } from 'vitest';
import { DesignElement } from '@minddrop/designs-next';
import { titleDesignElement } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '../DesignPropertiesProvider';
import { cleanup } from '../test-utils';
import { useElementValue } from './useElementValue';

const properties: PropertiesSchema = [
  { type: 'title', name: 'Title' },
  { type: 'text', name: 'Summary' },
  { type: 'icon', name: 'Icon' },
];

const values: PropertyMap = {
  Title: 'The entry title',
  Summary: null,
  Icon: 'lucide:file:default',
};

/**
 * Renders the value the hook resolves for an element.
 */
const ValueProbe: React.FC<{ element: DesignElement }> = ({ element }) => (
  <div data-testid="value">{useElementValue(element) ?? 'none'}</div>
);

/**
 * Renders the probe on an element mapped to the given property.
 *
 * @param property - The property the element maps to.
 */
function renderProbe(property?: string) {
  const element: DesignElement = { ...titleDesignElement, property };

  render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <ValueProbe element={element} />
    </DesignPropertiesProvider>,
  );
}

describe('useElementValue', () => {
  afterEach(cleanup);

  it("resolves the mapped property's value", () => {
    renderProbe('Title');

    expect(screen.getByTestId('value').textContent).toBe('The entry title');
  });

  it('resolves nothing for an unmapped element', () => {
    renderProbe();

    expect(screen.getByTestId('value').textContent).toBe('none');
  });

  it('resolves nothing for a property which is no longer provided', () => {
    renderProbe('Removed');

    expect(screen.getByTestId('value').textContent).toBe('none');
  });

  it('resolves nothing for a property holding no value', () => {
    renderProbe('Summary');

    expect(screen.getByTestId('value').textContent).toBe('none');
  });

  it('resolves nothing for a property with no text form', () => {
    renderProbe('Icon');

    expect(screen.getByTestId('value').textContent).toBe('none');
  });

  it('resolves nothing outside a provider', () => {
    render(
      <ValueProbe element={{ ...titleDesignElement, property: 'Title' }} />,
    );

    expect(screen.getByTestId('value').textContent).toBe('none');
  });
});
