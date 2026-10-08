import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { render, screen, waitFor } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import {
  ContentIconComponent,
  registerContentIconSet,
} from '@minddrop/ui-icons';
import { cleanup } from '../../../test-utils';
import { ToggleElement } from '../ToggleElement.types';
import { ToggleElementConfig } from '../ToggleElementConfig';
import { ToggleElementRenderer } from './ToggleElementRenderer';

const { iconDesignElement } = DesignElementFixtures;

// A toggle element mapped to the Done property
const toggleElement: ToggleElement = {
  ...iconDesignElement,
  type: ToggleElementConfig.type,
  property: 'Done',
};

// The schema with the Done property
const properties: PropertiesSchema = [{ type: 'toggle', name: 'Done' }];

// The ID of the stub icon set the picked icons come from
const TestIconSetId = 'test-icons';

// A toggle element drawing picked icons
const iconToggleElement: ToggleElement = {
  ...toggleElement,
  style: 'icon',
  checkedIcon: `${TestIconSetId}:star:default`,
  uncheckedIcon: `${TestIconSetId}:circle:default`,
};

/**
 * Renders a stub icon as a frame carrying the icon's name.
 */
const StubIcon: ContentIconComponent = ({ name }) => (
  <svg data-icon-name={name} />
);

/**
 * Renders the element with the given property values.
 *
 * @param element - The element to render.
 * @param values - The property values, keyed by property name.
 * @returns The render container.
 */
function renderToggle(element: ToggleElement, values: PropertyMap = {}) {
  const { container } = render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <ToggleElementRenderer element={element} />
    </DesignPropertiesProvider>,
  );

  return container;
}

/**
 * Waits for the stub set to load and asserts the icon of the given
 * name is drawn.
 *
 * @param container - The render container.
 * @param name - The icon's name.
 */
function expectIconDrawn(container: HTMLElement, name: string) {
  return waitFor(() => {
    expect(
      container.querySelector(`[data-icon-name="${name}"]`),
    ).toBeInTheDocument();
  });
}

describe('ToggleElementRenderer', () => {
  beforeAll(() => {
    // Register a stub icon set, so the drawn icon is observable
    // once it loads.
    registerContentIconSet({
      id: TestIconSetId,
      name: 'Test icons',
      load: () =>
        Promise.resolve({
          icons: { star: StubIcon, circle: StubIcon },
          metadata: {
            id: TestIconSetId,
            name: 'Test icons',
            icons: [],
            categories: [],
            labels: [],
          },
        }),
    });
  });

  afterEach(cleanup);

  it('draws a checkbox checked for a true value', () => {
    renderToggle(toggleElement, { Done: true });

    expect(screen.getByRole('checkbox', { name: 'Done' })).toBeChecked();
  });

  it('draws the checkbox unchecked for a false value', () => {
    renderToggle(toggleElement, { Done: false });

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('draws the checkbox unchecked when the property has no value', () => {
    renderToggle(toggleElement);

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('draws the checkbox checked when unmapped', () => {
    renderToggle({ ...toggleElement, property: undefined }, { Done: false });

    expect(screen.getByRole('checkbox', { name: 'Toggle' })).toBeChecked();
  });

  it('draws the control at the picked size', () => {
    const container = renderToggle({ ...toggleElement, size: 'lg' });

    expect(
      container.querySelector('.checkbox-indicator-size-lg'),
    ).toBeInTheDocument();
  });

  it('draws a switch for the switch style', () => {
    renderToggle({ ...toggleElement, style: 'switch' }, { Done: true });

    expect(screen.getByRole('switch', { name: 'Done' })).toBeChecked();
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('draws the picked checked icon while checked', async () => {
    const container = renderToggle(iconToggleElement, { Done: true });

    await expectIconDrawn(container, 'star');
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('draws the picked unchecked icon otherwise', async () => {
    const container = renderToggle(iconToggleElement, { Done: false });

    await expectIconDrawn(container, 'circle');
  });

  it('labels the icon style On while checked', () => {
    renderToggle({ ...toggleElement, style: 'icon' }, { Done: true });

    expect(screen.getByRole('img', { name: 'On' })).toBeInTheDocument();
  });

  it('labels the icon style Off otherwise', () => {
    renderToggle({ ...toggleElement, style: 'icon' }, { Done: false });

    expect(screen.getByRole('img', { name: 'Off' })).toBeInTheDocument();
  });
});
