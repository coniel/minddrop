import { afterEach, describe, expect, it } from 'vitest';
import { titleDesignElement } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup } from '../../../test-utils';
import { LabelElement } from '../LabelElement.types';
import { LabelElementConfig } from '../LabelElementConfig';
import { LabelElementRenderer } from './LabelElementRenderer';

// A label with its own text content
const labelElement: LabelElement = {
  ...titleDesignElement,
  type: LabelElementConfig.type,
  content: 'The typed label',
};

const properties: PropertiesSchema = [{ type: 'date', name: 'Due date' }];

const values: PropertyMap = { 'Due date': new Date('2026-09-16') };

/**
 * Renders the label against the fixture properties.
 *
 * @param property - The property the label maps to.
 */
function renderLabel(property?: string) {
  render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <LabelElementRenderer element={{ ...labelElement, property }} />
    </DesignPropertiesProvider>,
  );
}

describe('LabelElementRenderer', () => {
  afterEach(cleanup);

  it("renders the mapped property's name", () => {
    renderLabel('Due date');

    expect(screen.getByText('Due date')).toBeInTheDocument();
  });

  it("does not render the mapped property's value", () => {
    renderLabel('Due date');

    expect(screen.queryByText(/2026/)).not.toBeInTheDocument();
  });

  it('renders the typed text when the label maps to no property', () => {
    renderLabel();

    expect(screen.getByText('The typed label')).toBeInTheDocument();
  });

  it('renders the typed text when the property is no longer provided', () => {
    renderLabel('Removed');

    expect(screen.getByText('The typed label')).toBeInTheDocument();
  });

  it('applies the text settings as styles', () => {
    render(
      <LabelElementRenderer element={{ ...labelElement, fontSize: 18 }} />,
    );

    expect(screen.getByText('The typed label')).toHaveStyle({
      fontSize: '18px',
    });
  });
});
