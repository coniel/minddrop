import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyIconStyle, TypographyStyle } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { PropertyType } from '@minddrop/properties';
import {
  cleanup as cleanupRender,
  render,
  screen,
  userEvent,
} from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../../DesignStudioStore';
import { cleanup, setup } from '../../test-utils';
import { FlatDesignElement, FlatTextElement } from '../../types';
import { PropertyIconSection } from './PropertyIconSection';

const { design_books, layout_card_1, element_text_1 } = DesignFixtures;

describe('<PropertyIconSection />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('enables the icon when the section opens', async () => {
    const studio = openPropertyElement('text', 'short');

    renderSection(studio);

    // Open the collapsed Icon section
    await userEvent.click(
      screen.getByText('designsStudio.style.sections.icon'),
    );

    // Opening enabled the icon at its default variant
    expect(readElementStyle(studio).icon).toEqual({ variant: 'side' });
  });

  it('writes the chosen variant', async () => {
    const studio = openPropertyElement('text', 'short');

    // Start from an enabled icon, which holds the section open
    setIconStyle(studio, { variant: 'side' });

    renderSection(studio);

    await userEvent.click(
      screen.getByText('designsStudio.style.iconVariant.above.label'),
    );

    expect(readElementStyle(studio).icon).toEqual({ variant: 'above' });
  });

  it('removes the icon when the section is cleared', async () => {
    const studio = openPropertyElement('text', 'short');

    setIconStyle(studio, { variant: 'above', color: 'solid' });

    renderSection(studio);

    // The set values hold the section open with a clear button
    await userEvent.click(
      screen.getByLabelText('designs.clear-custom-styling'),
    );

    expect('icon' in readElementStyle(studio)).toBe(false);
  });

  it('renders nothing for variants withholding the icon key', () => {
    const studio = openPropertyElement('title', 'md');

    renderSection(studio);

    expect(screen.queryByText('designsStudio.style.sections.icon')).toBeNull();
  });

  it('renders nothing for variants outside the value-like categories', () => {
    const studio = openPropertyElement('image', 'image');

    renderSection(studio);

    expect(screen.queryByText('designsStudio.style.sections.icon')).toBeNull();
  });
});

/**
 * Opens the books design with its card layout active and the text
 * element replaced by a property element of the given type and
 * variant, keeping its ID.
 */
function openPropertyElement(propertyType: PropertyType, variant: string) {
  const studio = createDesignStudioStore();

  studio.initialize(design_books, design_books.properties);
  studio.setActiveLayout(layout_card_1.id);

  // Replace the text element with the property element under test
  const element = studio.getDesignElement<FlatTextElement>(
    element_text_1.id,
    layout_card_1.id,
  );

  studio.setDesignElement(element_text_1.id, {
    ...element,
    type: 'property',
    propertyType,
    variant,
  } as FlatDesignElement);

  return studio;
}

/**
 * Renders the icon section for the converted element.
 */
function renderSection(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <PropertyIconSection elementId={element_text_1.id} />
    </DesignStudioProvider>,
  );
}

/**
 * Writes an icon style onto the converted element.
 */
function setIconStyle(studio: DesignStudioStore, icon: PropertyIconStyle) {
  const element = studio.getDesignElement<FlatDesignElement>(
    element_text_1.id,
    layout_card_1.id,
  );

  studio.setDesignElement(element_text_1.id, {
    ...element,
    style: { ...element.style, icon },
  } as FlatDesignElement);
}

/**
 * Reads the converted element's style from the store.
 */
function readElementStyle(studio: DesignStudioStore): TypographyStyle {
  return studio.getDesignElement<FlatDesignElement>(
    element_text_1.id,
    layout_card_1.id,
  ).style as TypographyStyle;
}
