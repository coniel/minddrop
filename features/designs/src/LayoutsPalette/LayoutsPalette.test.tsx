import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { DragAndDrop } from '@minddrop/drag-and-drop';
import {
  cleanup as cleanupDragAndDrop,
  dragOver,
} from '@minddrop/drag-and-drop/test-utils';
import { cleanup as cleanupRender, render, screen } from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { DesignLayoutTypesDataKey } from '../constants';
import { cleanup, setup } from '../test-utils';
import { LayoutsPalette } from './LayoutsPalette';

const { design_books, design_space_virtual } = DesignFixtures;

describe('<LayoutsPalette />', () => {
  beforeEach(setup);

  afterEach(async () => {
    cleanupRender();
    cleanupDragAndDrop();
    await cleanup();
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

  it('drags the layout type an item stands for', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    renderPalette(studio);

    // Pick the item up
    dragOver(screen.getByText('designs.layouts.card.label'), document.body);

    expect(DragAndDrop.getActiveDrag()).toEqual(
      expect.objectContaining({
        data: {
          [DesignLayoutTypesDataKey]: [{ layoutType: 'card' }],
        },
      }),
    );
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
