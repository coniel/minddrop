import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FormattedTextPropertyElement } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
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
} from '../DesignStudioStore';
import { cleanup, setup } from '../test-utils';
import { FlatDesignElement, FlatTextElement } from '../types';
import { EditorStyleEditor } from './EditorStyleEditor';

const { design_books, layout_card_1, element_text_1 } = DesignFixtures;

describe('<EditorStyleEditor />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('binds the design title property when the Title section opens', async () => {
    const studio = openEditorElement();

    renderEditor(studio);

    // Open the collapsed Title section
    await userEvent.click(
      screen.getByText('designsStudio.style.sections.title'),
    );

    // Opening bound the design's title property as the title
    expect(readEditorElement(studio).titleProperty).toBe('Title');
  });

  it('rebinds the title through the property select', async () => {
    const studio = openEditorElement();

    studio.updateDesignElement(element_text_1.id, { titleProperty: 'Title' });

    renderEditor(studio);

    // Choose another title-compatible property. The open section
    // also shows the title typography selects, so the property
    // select is picked out by its label.
    await userEvent.click(screen.getByLabelText('designs.property.label'));
    await userEvent.click(screen.getByText('Subtitle'));

    expect(readEditorElement(studio).titleProperty).toBe('Subtitle');
  });

  it('unbinds the title when the Title section is cleared', async () => {
    const studio = openEditorElement();

    studio.updateDesignElement(element_text_1.id, { titleProperty: 'Title' });

    renderEditor(studio);

    // The binding alone holds the section open with a clear button
    await userEvent.click(
      screen.getByLabelText('designs.clear-custom-styling'),
    );

    expect(readEditorElement(studio).titleProperty).toBeUndefined();
  });
});

/**
 * Opens the books design with its card layout active and the
 * text element replaced by a formatted text property element on
 * its editor variant.
 */
function openEditorElement() {
  const studio = createDesignStudioStore();

  studio.initialize(design_books, design_books.properties);
  studio.setActiveLayout(layout_card_1.id);

  // Replace the text element with a formatted text property
  // element, keeping its ID so the editor renders the same slot
  const element = studio.getDesignElement<FlatTextElement>(
    element_text_1.id,
    layout_card_1.id,
  );

  studio.setDesignElement(element_text_1.id, {
    ...element,
    type: 'property',
    propertyType: 'formatted-text',
    variant: 'editor',
  } as FlatDesignElement);

  return studio;
}

/**
 * Renders the editor style editor for the converted element.
 */
function renderEditor(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <EditorStyleEditor elementId={element_text_1.id} />
    </DesignStudioProvider>,
  );
}

/**
 * Reads the converted editor element from the store.
 */
function readEditorElement(
  studio: DesignStudioStore,
): FormattedTextPropertyElement {
  return studio.getDesignElement<
    FormattedTextPropertyElement & { parent: string }
  >(element_text_1.id, layout_card_1.id);
}
