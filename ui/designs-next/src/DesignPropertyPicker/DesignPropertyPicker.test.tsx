import { afterEach, describe, expect, it } from 'vitest';
import { PropertiesSchema, PropertyType } from '@minddrop/properties';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup } from '../test-utils';
import { DesignPropertyPicker } from './DesignPropertyPicker';

// The property name passed to the most recent change callback
let changedProperty: string | undefined | null;

const properties: PropertiesSchema = [
  { type: 'title', name: 'Title', icon: 'lucide:type:default' },
  { type: 'text', name: 'Summary', icon: 'lucide:text:default' },
  { type: 'image', name: 'Cover', icon: 'lucide:image:default' },
  { type: 'icon', name: 'Icon', icon: 'lucide:smile:default' },
];

// The types a text-shaped element accepts, and the narrower set it
// is meant for.
const types: PropertyType[] = ['title', 'text', 'image'];
const suggestedTypes: PropertyType[] = ['title', 'text'];

interface RenderPickerOptions {
  /**
   * The picked property's name.
   */
  value?: string;

  /**
   * The property types the element is meant for.
   */
  suggestedTypes?: PropertyType[];
}

/**
 * Renders the picker with a recording change callback.
 *
 * @param options - The picker's state.
 */
async function renderPicker(options: RenderPickerOptions = {}) {
  changedProperty = null;

  render(
    <FloatingToolbar visible>
      <DesignPropertyPicker
        properties={properties}
        value={options.value}
        types={types}
        suggestedTypes={options.suggestedTypes ?? suggestedTypes}
        onValueChange={(property) => {
          changedProperty = property;
        }}
      />
    </FloatingToolbar>,
  );

  await userEvent.click(screen.getByLabelText('Property'));
}

/**
 * Returns the labels of the menu's property options, in the order
 * they are listed.
 *
 * @returns The option labels.
 */
function listedProperties(): string[] {
  return screen
    .getAllByRole('menuitem')
    .map((item) => item.textContent ?? '')
    .filter((label) => label !== 'No property');
}

describe('DesignPropertyPicker', () => {
  afterEach(cleanup);

  it('lists only the properties the element accepts', async () => {
    await renderPicker();

    // The icon property's type is not among the accepted ones
    expect(listedProperties()).not.toContain('Icon');
  });

  it('lists the suggested properties above the rest', async () => {
    await renderPicker();

    expect(listedProperties()).toEqual(['Title', 'Summary', 'Cover']);
  });

  it('reports the picked property', async () => {
    await renderPicker();

    await userEvent.click(screen.getByText('Summary'));

    expect(changedProperty).toBe('Summary');
  });

  it('clears the mapping through the none option', async () => {
    await renderPicker({ value: 'Title' });

    await userEvent.click(screen.getByText('No property'));

    expect(changedProperty).toBeUndefined();
  });

  it('leaves the properties ungrouped without suggested types', async () => {
    await renderPicker({ suggestedTypes: [] });

    expect(listedProperties()).toEqual(['Title', 'Summary', 'Cover']);
    expect(screen.queryByText('Suggested')).not.toBeInTheDocument();
  });
});
