import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { TranslationKey, i18n } from '@minddrop/i18n';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
  within,
} from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { insertPropertyElement } from '../insertPropertyElement';
import { cleanup, setup } from '../test-utils';
import { FlatPropertyElement, FlatRootDesignElement } from '../types';
import { ElementStyleEditor } from './ElementStyleEditor';

const {
  design_books,
  layout_card_1,
  layout_page_1,
  element_text_1,
  element_container_1,
} = DesignFixtures;

describe('<ElementStyleEditor />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('prompts to select an element when nothing is selected', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    renderEditor(studio);

    screen.getByText('designsStudio.editor.empty');
  });

  it('renders the typography editor for a text element', () => {
    const studio = openCardLayout();

    // Select the layout's text element
    studio.selectElement(element_text_1.id, layout_card_1.id);

    renderEditor(studio);

    // The typography sections are offered, closed until opened
    const textSection = getSection('designsStudio.style.sections.typography');

    expect(textSection).not.toBeNull();
    expect(
      screen.queryByText('designsStudio.style.fields.fontSize'),
    ).toBeNull();

    openSection('designsStudio.style.sections.typography');

    // The type fields appear once the section is open
    within(textSection as HTMLElement).getByText(
      'designsStudio.style.fields.fontSize',
    );
    within(textSection as HTMLElement).getByText(
      'designsStudio.style.fields.fontWeight',
    );

    // Container sections are not offered, since text uses another
    // style category
    expect(getSection('designsStudio.style.sections.layout')).toBeNull();
  });

  it('renders the container editor for a container element', () => {
    const studio = openCardLayout();

    // Select the layout's container element
    studio.selectElement(element_container_1.id, layout_card_1.id);

    renderEditor(studio);

    openSection('designsStudio.style.sections.layout');

    // Container layout fields are offered
    screen.getByText('designsStudio.style.fields.direction');
    screen.getByText('designsStudio.style.fields.gap');
  });

  it('offers no editor for a style key the element role controls', () => {
    const studio = openCardLayout();

    // Give the text element the card title role, which locks its
    // weight, line height and colour
    const element = studio.getDesignElement(
      element_text_1.id,
      layout_card_1.id,
    );

    const roleElement = { ...element, role: 'title' };

    studio.setDesignElement(element_text_1.id, roleElement);
    studio.selectElement(element_text_1.id, layout_card_1.id);

    renderEditor(studio);

    openSection('designsStudio.style.sections.typography');

    // The locked keys render no field at all. Each is matched
    // within the text section, since other panel parts reuse the
    // same short labels (e.g. the size variant axis).
    const textSection = getSection(
      'designsStudio.style.sections.typography',
    ) as HTMLElement;

    expect(
      within(textSection).queryByLabelText('designsStudio.style.fields.italic'),
    ).toBeNull();
    expect(
      within(textSection).queryByText('designsStudio.style.fields.lineHeight'),
    ).toBeNull();

    // The size is locked by the role's default variant option
    expect(
      within(textSection).queryByText('designsStudio.style.fields.fontSize'),
    ).toBeNull();

    // Keys outside the role's editable styles list render no
    // field either, even though the role locks no value for them
    expect(
      within(textSection).queryByText(
        'designsStudio.style.fields.letterSpacing',
      ),
    ).toBeNull();

    // A section none of whose keys are editable renders nothing
    expect(getSection('designsStudio.style.sections.size')).toBeNull();

    // Keys the role offers stay editable
    within(textSection).getByText('designsStudio.style.fields.textAlign');
  });

  it('always shows the content section, without collapsing it', () => {
    const studio = openCardLayout();

    studio.selectElement(element_text_1.id, layout_card_1.id);

    renderEditor(studio);

    // Content is not styling, so it is offered without a section
    // to open first
    screen.getByText('designs.content.label');
    screen.getByText('designs.content.mode.static');
  });

  it('resets the element styling from the header', () => {
    const studio = openCardLayout();

    // Give the text element a style key to clear
    studio.updateElementStyle(element_text_1.id, 'fontSize', 'lg');
    studio.selectElement(element_text_1.id, layout_card_1.id);

    renderEditor(studio);

    // The header eraser comes before the per-section ones
    fireEvent.click(
      screen.getAllByLabelText('designs.clear-custom-styling')[0],
    );

    expect(studio.getDesignElement(element_text_1.id).style).toEqual({});
  });

  it('keeps the panel row when clearing a panelled root', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(layout_page_1.id);

    // Dock a panel, which switches the root to a panel row
    studio.addPagePanel('left');

    // Give the root a style key the reset should clear
    studio.updateElementStyle('root', 'gap', '4');
    studio.selectElement('root', layout_page_1.id);

    renderEditor(studio);

    fireEvent.click(
      screen.getAllByLabelText('designs.clear-custom-styling')[0],
    );

    const root = studio.getDesignElement<FlatRootDesignElement>('root');

    // The row arrangement survives as panel structure, and the
    // reset lands on the page's default styling rather than none
    expect(root.style).toEqual({ direction: 'row', contentPadding: '4' });

    // The panel itself is untouched
    expect(
      root.children.some(
        (childId) => studio.getDesignElement(childId)?.type === 'page-panel',
      ),
    ).toBe(true);
  });

  it('renders the variant axes of the element role', () => {
    const studio = openCardLayout();

    const element = studio.getDesignElement(
      element_text_1.id,
      layout_card_1.id,
    );

    const roleElement = { ...element, role: 'title' };

    studio.setDesignElement(element_text_1.id, roleElement);
    studio.selectElement(element_text_1.id, layout_card_1.id);

    renderEditor(studio);

    // The role's size axis is offered
    screen.getByText('designs.roleVariantAxes.size');
  });

  it('renders the variant picker of a property element', () => {
    const studio = openCardLayout();

    // Insert a text property element, which selects it
    insertPropertyElement(studio, 'text', 'root', 0, layout_card_1.id);

    renderEditor(studio);

    // Each presentation variant is offered with its sample
    screen.getByText('designs.propertyElements.variants.short');
    screen.getByText('designs.propertyElements.variants.quote');
    screen.getByText('designs.propertyElements.samples.long');
  });

  it('offers the colour treatment fields on a text property element', () => {
    const studio = openCardLayout();

    // Insert a text property element, which selects it
    insertPropertyElement(studio, 'text', 'root', 0, layout_card_1.id);

    renderEditor(studio);

    openSection('designsStudio.style.sections.colour');

    // The colour steps are offered
    screen.getByText('designsStudio.style.textColour.regular.label');
    screen.getByText('designsStudio.style.textColour.subtle.label');
    screen.getByText('designsStudio.style.textColour.solid.label');
  });

  it('offers no editor for a style key the property variant controls', () => {
    const studio = openCardLayout();

    // Insert a text property element presented as a subtitle,
    // whose theme styles lock its colour, line height and font size
    insertPropertyElement(studio, 'text', 'root', 0, layout_card_1.id);

    const elementId = studio.getSelectedElementId() as string;
    const element = studio.getDesignElement<FlatPropertyElement>(
      elementId,
      layout_card_1.id,
    );

    studio.setDesignElement(elementId, {
      ...element,
      variant: 'subtitle',
    });

    renderEditor(studio);

    openSection('designsStudio.style.sections.typography');

    const textSection = getSection(
      'designsStudio.style.sections.typography',
    ) as HTMLElement;

    // The locked keys render no field at all
    expect(
      within(textSection).queryByText('designsStudio.style.fields.lineHeight'),
    ).toBeNull();
    expect(
      within(textSection).queryByText('designsStudio.style.fields.fontSize'),
    ).toBeNull();

    // Keys outside the variant's editable styles list render no
    // field either
    expect(
      within(textSection).queryByText(
        'designsStudio.style.fields.letterSpacing',
      ),
    ).toBeNull();

    // Keys the variant offers stay editable
    within(textSection).getByText('designsStudio.style.fields.textAlign');
  });

  it('renders the format section per property type', () => {
    const studio = openCardLayout();

    // Insert a number property element, which selects it
    insertPropertyElement(studio, 'number', 'root', 0, layout_card_1.id);

    renderEditor(studio);

    // The number format settings are offered
    screen.getByText('designs.number-format.label');

    // A single fixed presentation offers no variant picker
    expect(
      screen.queryByText('designsStudio.style.sections.variant'),
    ).toBeNull();
  });
});

/**
 * Opens the books design with its card layout active.
 */
function openCardLayout(): DesignStudioStore {
  const studio = createDesignStudioStore();

  studio.initialize(design_books);
  studio.setActiveLayout(layout_card_1.id);

  return studio;
}

/**
 * Finds a style section by its header label, or null when no
 * section carries it.
 */
function getSection(label: TranslationKey): HTMLElement | null {
  const text = i18n.t(label);

  // Match against the section labels only, since short labels like
  // "Text" also appear in fields elsewhere in the panel
  const sectionLabel = Array.from(
    document.querySelectorAll('.designs-style-section-label'),
  ).find((candidate) => candidate.textContent === text);

  return (sectionLabel?.closest('.designs-style-section') ??
    null) as HTMLElement | null;
}

/**
 * Opens a collapsed style section by clicking its header.
 */
function openSection(label: TranslationKey) {
  fireEvent.click(getSection(label)?.firstElementChild as HTMLElement);
}

/**
 * Renders the style editor within the given studio instance.
 */
function renderEditor(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <ElementStyleEditor />
    </DesignStudioProvider>,
  );
}
