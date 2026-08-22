import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { PropertiesSchema } from '@minddrop/properties';
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
import { FlatTextElement } from '../../types';
import { ElementContentSection } from './ElementContentSection';

const { design_books, layout_card_1, element_text_1 } = DesignFixtures;

// Schemas widening the fixture design so URL, webview and editor
// elements have a compatible property to bind to
const urlProperty: PropertiesSchema = [{ type: 'url', name: 'Link' }];
const formattedTextProperty: PropertiesSchema = [
  { type: 'formatted-text', name: 'Body' },
];

describe('<ElementContentSection />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('offers both content modes when property binding is enabled', () => {
    renderSection(openCardLayout());

    // "Property" also labels the property select, so several
    // matches are expected
    expect(
      screen.getAllByText('designs.content.mode.property').length,
    ).toBeGreaterThan(0);
    screen.getByText('designs.content.mode.static');
  });

  it('offers only static content when property binding is disabled', () => {
    const studio = openCardLayout();

    // Standalone layout editing has no property schema to bind to
    studio.store.setState({ propertyBindingEnabled: false });

    renderSection(studio);

    expect(screen.queryByText('designs.content.mode.property')).toBeNull();

    // The static content input is shown on its own
    screen.getByRole('textbox');
  });

  it('binds the element to the chosen property', async () => {
    const studio = openCardLayout();

    renderSection(studio);

    // Choose the first text property the element can render
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Subtitle'));

    expect(readTextElement(studio).property).toBe('Subtitle');
  });

  it('restricts the property options to compatible types', async () => {
    const studio = openCardLayout();

    renderSection(studio);

    await userEvent.click(screen.getByRole('combobox'));

    // Text elements render text-like properties
    screen.getByText('Subtitle');
    screen.getByText('Summary');

    // The image property has no text to render
    expect(screen.queryByText('Cover')).toBeNull();
  });

  it('switches the element to static content', async () => {
    const studio = openCardLayout();

    // Start from a bound element so the binding has something to clear
    studio.updateDesignElement(element_text_1.id, { property: 'Subtitle' });

    renderSection(studio);

    await userEvent.click(screen.getByText('designs.content.mode.static'));

    const element = readTextElement(studio);

    // The element displays its own content, with the binding gone
    expect(element.static).toBe(true);
    expect('property' in element).toBe(false);
  });

  it('switches a static element back to property binding', async () => {
    const studio = openCardLayout();

    studio.updateDesignElement(element_text_1.id, {
      static: true,
      content: 'Written by hand',
    });

    renderSection(studio);

    await userEvent.click(
      screen.getAllByText('designs.content.mode.property')[0],
    );

    const element = readTextElement(studio);

    // The static content is cleared so it cannot resurface later
    expect(element.static).toBe(false);
    expect(element.content).toBe('');
  });

  it('writes a static content edit to the element', async () => {
    const studio = openCardLayout();

    studio.updateDesignElement(element_text_1.id, { static: true });

    renderSection(studio);

    await userEvent.type(screen.getByRole('textbox'), 'Chapter one');

    expect(readTextElement(studio).content).toBe('Chapter one');
  });

  it('offers no static mode for roles restricted to bound data', () => {
    const studio = openCardLayout();

    // Give the text element the title role, which renders entry
    // data only
    const element = studio.getDesignElement(
      element_text_1.id,
      layout_card_1.id,
    );

    const roleElement = { ...element, role: 'title' };

    studio.setDesignElement(element_text_1.id, roleElement);

    renderSection(studio);

    // The property select is still offered, without a mode toggle
    expect(
      screen.getAllByText('designs.content.mode.property').length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText('designs.content.mode.static')).toBeNull();
  });

  it('offers no static mode for always bound element types', () => {
    // A fixed link belongs in a text element, so URL elements are
    // property bound only
    const studio = openCardLayout(urlProperty);

    convertTextElement(studio, 'url');

    renderSection(studio);

    expect(screen.queryByText('designs.content.mode.static')).toBeNull();
  });

  it('keeps an always bound element in property mode', async () => {
    const studio = openCardLayout(urlProperty);

    convertTextElement(studio, 'url');

    // A stale static flag must not strand the section without
    // controls, since there is no toggle to leave static mode
    studio.updateDesignElement(element_text_1.id, { static: true });

    renderSection(studio);

    // The property select is shown rather than a content input
    screen.getByRole('combobox');
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('offers no empty behaviour control for a bound element', async () => {
    const studio = openCardLayout();

    renderSection(studio);

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Subtitle'));

    // What an element does with an empty value is a fact about its
    // type, not a per-element choice
    expect(
      screen.queryByText('designs.content.emptyBehavior.label'),
    ).toBeNull();
    expect(screen.queryByRole('switch')).toBeNull();
  });

  it('offers no empty behaviour control for element types whose empty state is expected', () => {
    const studio = openCardLayout(formattedTextProperty);

    convertTextElement(studio, 'editor');
    studio.updateDesignElement(element_text_1.id, { property: 'Body' });

    renderSection(studio);

    // The property select proves the section itself rendered, so
    // the missing empty behaviour is a real absence
    screen.getByRole('combobox');
    expect(
      screen.queryByText('designs.content.emptyBehavior.label'),
    ).toBeNull();
    expect(screen.queryByRole('switch')).toBeNull();
  });

  it('renders nothing for elements binding their image from the background fields', () => {
    const studio = openCardLayout();

    // Containers configure their image in the background fields
    const { container } = render(
      <DesignStudioProvider store={studio}>
        <ElementContentSection elementId="root" />
      </DesignStudioProvider>,
    );

    expect(container.textContent).toBe('');
  });
});

/**
 * Opens the books design with its card layout active. Extra
 * properties widen the schema so element types beyond text have
 * something compatible to bind to.
 */
function openCardLayout(extraProperties: PropertiesSchema = []) {
  const studio = createDesignStudioStore();
  const properties = [...design_books.properties, ...extraProperties];
  const design = { ...design_books, properties };

  studio.initialize(design, properties);
  studio.setActiveLayout(layout_card_1.id);

  return studio;
}

/**
 * Renders the content section for the layout's text element.
 */
function renderSection(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <ElementContentSection elementId={element_text_1.id} />
    </DesignStudioProvider>,
  );
}

/**
 * Retypes the layout's text element, so the section can be
 * rendered for element types with no fixture of their own.
 */
function convertTextElement(studio: DesignStudioStore, type: string) {
  const element = readTextElement(studio);

  studio.setDesignElement(element_text_1.id, {
    ...element,
    type,
  } as FlatTextElement);
}

/**
 * Reads the layout's text element from the store.
 */
function readTextElement(studio: DesignStudioStore): FlatTextElement {
  return studio.getDesignElement<FlatTextElement>(
    element_text_1.id,
    layout_card_1.id,
  );
}
