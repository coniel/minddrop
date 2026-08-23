import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyElement } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../../test-utils';
import { PropertyDesignElement } from './PropertyDesignElement';

const { element_property_text_1, element_property_number_1 } = DesignFixtures;

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

  it('renders nothing for property types without a config', () => {
    const element = {
      ...element_property_text_1,
      propertyType: 'toggle',
    } as unknown as PropertyElement;

    const { container } = render(<PropertyDesignElement element={element} />);

    expect(container.firstChild).toBeNull();
  });
});
