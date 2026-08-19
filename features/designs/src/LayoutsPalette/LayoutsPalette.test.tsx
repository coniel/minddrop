import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { cleanup, setup } from '../test-utils';
import { LayoutsPalette } from './LayoutsPalette';

const { design_books, design_space_virtual } = DesignFixtures;

describe('<LayoutsPalette />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('lists the layout types the design supports', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    renderPalette(studio);

    // Database designs offer card, list and page layouts
    screen.getByText('designs.layouts.card.label');
    screen.getByText('designs.layouts.list.label');
    screen.getByText('designs.layouts.page.label');

    // Layout types of other design types are not offered
    expect(screen.queryByText('designs.layouts.space.label')).toBeNull();
  });

  it('offers only the space layout for space designs', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_space_virtual);

    renderPalette(studio);

    screen.getByText('designs.layouts.space.label');
    expect(screen.queryByText('designs.layouts.card.label')).toBeNull();
  });

  it('renders the items as draggable', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    const { container } = renderPalette(studio);

    // Every item can be picked up and dropped onto the canvas
    const items = container.querySelectorAll('.designs-palette-item');

    expect(items.length).toBe(3);

    items.forEach((item) => {
      expect(item.getAttribute('draggable')).toBe('true');
    });
  });
});

/**
 * Renders the layouts palette within the studio provider.
 */
function renderPalette(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <LayoutsPalette />
    </DesignStudioProvider>,
  );
}
