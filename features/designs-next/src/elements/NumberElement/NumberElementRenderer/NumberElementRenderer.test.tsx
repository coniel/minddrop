import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup } from '../../../test-utils';
import { NumberElement } from '../NumberElement.types';
import { NumberElementConfig } from '../NumberElementConfig';
import { SampleNumber } from '../constants';
import { NumberElementRenderer } from './NumberElementRenderer';

const { titleDesignElement } = DesignElementFixtures;

// A number element mapped to the Price property, with content of
// its own which it never falls back to.
const numberElement: NumberElement = {
  ...titleDesignElement,
  type: NumberElementConfig.type,
  property: 'Price',
  content: 'Placeholder',
};

// The schema with the Price property
const properties: PropertiesSchema = [{ type: 'number', name: 'Price' }];

/**
 * Renders the element with the given property values.
 *
 * @param element - The element to render.
 * @param values - The property values, keyed by property name.
 * @returns The rendered element's box.
 */
function renderNumber(element: NumberElement, values: PropertyMap = {}) {
  // Render the element with the property values
  const { container } = render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <NumberElementRenderer element={element} />
    </DesignPropertiesProvider>,
  );

  // Find the element's box
  return container.querySelector<HTMLElement>('.design-text-element')!;
}

describe('NumberElementRenderer', () => {
  afterEach(cleanup);

  it('writes the mapped number with the places it has by default', () => {
    renderNumber(numberElement, { Price: 1234.56 });

    expect(screen.getByText('1234.56')).toBeInTheDocument();
  });

  it('writes the number at the decimal places set', () => {
    renderNumber({ ...numberElement, decimals: 2 }, { Price: 1234.5 });

    expect(screen.getByText('1234.50')).toBeInTheDocument();
  });

  it('groups the digits with the separator set', () => {
    renderNumber({ ...numberElement, separator: 'comma' }, { Price: 1234.5 });

    expect(screen.getByText('1,234.5')).toBeInTheDocument();
  });

  it('signs the number per the sign display set', () => {
    renderNumber({ ...numberElement, signDisplay: 'always' }, { Price: 5 });

    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  it('writes the number in the notation set', () => {
    renderNumber({ ...numberElement, notation: 'compact' }, { Price: 1500 });

    expect(screen.getByText('1.5k')).toBeInTheDocument();
  });

  it('writes the prefix and suffix either side of the number', () => {
    renderNumber(
      { ...numberElement, prefix: '$', suffix: ' each' },
      { Price: 5 },
    );

    expect(screen.getByText('$5 each')).toBeInTheDocument();
  });

  it('writes a sample number when unmapped', () => {
    renderNumber({ ...numberElement, property: undefined }, { Price: 1234.5 });

    expect(screen.getByText(String(SampleNumber))).toBeInTheDocument();
    expect(screen.queryByText(numberElement.content!)).toBeNull();
  });

  it('writes nothing when the property has no value', () => {
    const box = renderNumber({ ...numberElement, prefix: '$' });

    expect(box.textContent).toBe('');
    expect(screen.queryByText(numberElement.content!)).toBeNull();
  });
});
