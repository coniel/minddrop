import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyLabelStyle, TypographyStyle } from '@minddrop/designs';
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
import { PropertyLabelSection } from './PropertyLabelSection';

const { design_books, layout_card_1, element_text_1 } = DesignFixtures;

describe('<PropertyLabelSection />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('enables the label when the section opens', async () => {
    const studio = openPropertyElement('text', 'short');

    renderSection(studio);

    // Open the collapsed Label section
    await userEvent.click(
      screen.getByText('designsStudio.style.sections.label'),
    );

    // Opening enabled the label at its default variant
    expect(readElementStyle(studio).label).toEqual({ variant: 'above' });
  });

  it('writes the chosen variant', async () => {
    const studio = openPropertyElement('text', 'short');

    // Start from an enabled label, which holds the section open
    setLabelStyle(studio, { variant: 'above' });

    renderSection(studio);

    await userEvent.click(
      screen.getByText('designsStudio.style.labelVariant.spread.label'),
    );

    expect(readElementStyle(studio).label).toEqual({ variant: 'spread' });
  });

  it('removes the label when the section is cleared', async () => {
    const studio = openPropertyElement('text', 'short');

    setLabelStyle(studio, { variant: 'spread', color: 'solid' });

    renderSection(studio);

    // The set values hold the section open with a clear button
    await userEvent.click(
      screen.getByLabelText('designs.clear-custom-styling'),
    );

    expect('label' in readElementStyle(studio)).toBe(false);
  });

  it('renders nothing for variants withholding the label key', () => {
    const studio = openPropertyElement('title', 'md');

    renderSection(studio);

    expect(screen.queryByText('designsStudio.style.sections.label')).toBeNull();
  });

  it('renders nothing for variants outside the value-like categories', () => {
    const studio = openPropertyElement('image', 'image');

    renderSection(studio);

    expect(screen.queryByText('designsStudio.style.sections.label')).toBeNull();
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
 * Renders the label section for the converted element.
 */
function renderSection(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <PropertyLabelSection elementId={element_text_1.id} />
    </DesignStudioProvider>,
  );
}

/**
 * Writes a label style onto the converted element.
 */
function setLabelStyle(studio: DesignStudioStore, label: PropertyLabelStyle) {
  const element = studio.getDesignElement<FlatDesignElement>(
    element_text_1.id,
    layout_card_1.id,
  );

  studio.setDesignElement(element_text_1.id, {
    ...element,
    style: { ...element.style, label },
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
