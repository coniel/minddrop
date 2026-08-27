import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { cleanup, setup } from '../test-utils';
import { ElementsPalette } from './ElementsPalette';

const { design_books, layout_card_1 } = DesignFixtures;

describe('<ElementsPalette />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('lists the property elements under the properties group', () => {
    // Open a database design with its card layout active
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(layout_card_1.id);

    renderPalette(studio);

    // The properties group lists one element per property type
    screen.getByText('design-studio.elements.group.properties');
    screen.getByText('properties.title.name');
    screen.getByText('properties.text.name');
    screen.getByText('properties.number.name');
    screen.getByText('properties.date.name');
    screen.getByText('properties.select.name');
    screen.getByText('properties.url.name');
    screen.getByText('properties.image.name');
    screen.getByText('properties.icon.name');
  });

  it('lists each property element exactly once', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(layout_card_1.id);

    renderPalette(studio);

    // Every standalone entry the property elements replaced is
    // gone, so each label appears exactly once
    expect(screen.getAllByText('properties.number.name')).toHaveLength(1);
    expect(screen.getAllByText('properties.date.name')).toHaveLength(1);
    expect(screen.getAllByText('properties.image.name')).toHaveLength(1);
    expect(screen.getAllByText('properties.url.name')).toHaveLength(1);
  });

  it('offers the collection element on page layouts only', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(layout_card_1.id);

    renderPalette(studio);

    // An embedded view has no room to render on a card
    expect(screen.queryByText('properties.collection.name')).toBeNull();

    cleanupRender();

    // The page layout offers it
    studio.setActiveLayout(design_books.layouts[2].id);

    renderPalette(studio);

    screen.getByText('properties.collection.name');
  });

  it('groups layout chrome under the layout group', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(layout_card_1.id);

    renderPalette(studio);

    // The layout group lists its element types and roles
    screen.getByText('design-studio.elements.group.layout');
    screen.getByText('design-studio.elements.container');
    screen.getByText('designs.roles.heading.label');

    // The per-layout roles header is gone
    expect(
      screen.queryByText('designsStudio.palette.elements.card'),
    ).toBeNull();
  });

  it('excludes roles restricted away from the active layout', () => {
    // Open a database design with its list layout active
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(design_books.layouts[1].id);

    renderPalette(studio);

    // The heading role is offered everywhere
    screen.getByText('designs.roles.heading.label');

    // The content region restricts itself away from list layouts
    expect(screen.queryByText('designs.roles.page-content.label')).toBeNull();
  });

  it('excludes structural roles created by the studio', () => {
    // The page layout is the context in which the structural
    // content region role applies
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(design_books.layouts[2].id);

    const { container } = renderPalette(studio);

    // Roles offered on pages are listed
    screen.getByText('designs.roles.heading.label');

    // The page content region is created by the panel toggles,
    // never dragged from the palette
    const itemLabels = Array.from(
      container.querySelectorAll('.designs-palette-item'),
    ).map((item) => item.textContent);

    expect(itemLabels).not.toContain('designs.roles.page-content.label');
  });

  it('keeps the free-form text element out of the palette', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(layout_card_1.id);

    renderPalette(studio);

    // Free-form text is placed through its purpose roles instead:
    // the only "Text" entry is the text property element
    expect(screen.getAllByText('design-studio.elements.text')).toHaveLength(1);
  });
});

/**
 * Renders the palette within the given studio instance.
 */
function renderPalette(studio: ReturnType<typeof createDesignStudioStore>) {
  return render(
    <DesignStudioProvider store={studio}>
      <ElementsPalette />
    </DesignStudioProvider>,
  );
}
