import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { Tags } from '@minddrop/tags';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup } from '../../../test-utils';
import { ChipsElement } from '../ChipsElement.types';
import { ChipsElementConfig } from '../ChipsElementConfig';
import { ChipsElementRenderer } from './ChipsElementRenderer';

const { bodyDesignElement } = DesignElementFixtures;
const { tag_1, tags } = TagFixtures;

// A chips element mapped to the Status property
const chipsElement: ChipsElement = {
  ...bodyDesignElement,
  type: ChipsElementConfig.type,
  property: 'Status',
  content: 'Placeholder',
};

// The schema with a single select, a multiselect and a tags property
const properties: PropertiesSchema = [
  {
    type: 'select',
    name: 'Status',
    options: [
      { value: 'Open', color: 'green' },
      { value: 'Done', color: 'blue' },
    ],
  },
  {
    type: 'select',
    name: 'Labels',
    multiselect: true,
    options: [
      { value: 'Bug', color: 'red' },
      { value: 'Idea', color: 'purple' },
    ],
  },
  { type: 'tags', name: 'Tags' },
];

/**
 * Renders the element with the given property values.
 *
 * @param element - The element to render.
 * @param values - The property values, keyed by property name.
 * @returns The rendered element's box.
 */
function renderChips(element: ChipsElement, values: PropertyMap = {}) {
  // Render the element with the property values
  const { container } = render(
    <DesignPropertiesProvider properties={properties} values={values}>
      <ChipsElementRenderer element={element} />
    </DesignPropertiesProvider>,
  );

  // Find the element's box
  return container.querySelector<HTMLElement>('.design-chips-element')!;
}

describe('ChipsElementRenderer', () => {
  beforeEach(() => {
    // Load the tags
    Tags.Store.load(tags);
  });

  afterEach(() => {
    cleanup();
    Tags.Store.clear();
  });

  it('renders the mapped value as a chip', () => {
    renderChips(chipsElement, { Status: 'Open' });

    expect(screen.getByText('Open')).toHaveClass('chip');
  });

  it('colours a select value by its option', () => {
    renderChips(chipsElement, { Status: 'Open' });

    expect(screen.getByText('Open')).toHaveClass('chip-color-green');
  });

  it("renders each of a multiselect's values", () => {
    renderChips(
      { ...chipsElement, property: 'Labels' },
      { Labels: ['Bug', 'Idea'] },
    );

    expect(screen.getByText('Bug')).toHaveClass('chip-color-red');
    expect(screen.getByText('Idea')).toHaveClass('chip-color-purple');
  });

  it('colours a tags value by its tag', () => {
    renderChips({ ...chipsElement, property: 'Tags' }, { Tags: [tag_1.name] });

    expect(screen.getByText(tag_1.name)).toHaveClass(
      `chip-color-${tag_1.color}`,
    );
  });

  it('renders its content as a chip when unmapped', () => {
    renderChips({ ...chipsElement, property: undefined }, { Status: 'Open' });

    expect(screen.getByText(chipsElement.content!)).toHaveClass('chip');
    expect(screen.queryByText('Open')).toBeNull();
  });

  it('renders its content when the property has no value', () => {
    renderChips(chipsElement);

    expect(screen.getByText(chipsElement.content!)).toHaveClass('chip');
  });

  it('renders no chip without content or a value', () => {
    const box = renderChips({ ...chipsElement, content: undefined });

    expect(box.querySelector('.chip')).toBeNull();
  });

  it('rounds the chips by the small radius by default', () => {
    renderChips(chipsElement, { Status: 'Open' });

    expect(screen.getByText('Open').style.borderRadius).toBe(
      'var(--radius-sm)',
    );
  });

  it('rounds the chips by the corner radius set', () => {
    renderChips({ ...chipsElement, cornerRadius: 'full' }, { Status: 'Open' });

    expect(screen.getByText('Open').style.borderRadius).toBe(
      'var(--radius-full)',
    );
  });

  it('draws medium chips by default', () => {
    renderChips(chipsElement, { Status: 'Open' });

    expect(screen.getByText('Open')).toHaveClass('chip-size-md');
  });

  it('draws the chips at the size set', () => {
    renderChips({ ...chipsElement, size: 'lg' }, { Status: 'Open' });

    expect(screen.getByText('Open')).toHaveClass('chip-size-lg');
  });
});
