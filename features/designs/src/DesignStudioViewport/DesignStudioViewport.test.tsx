import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import {
  DragSource,
  cleanup as cleanupDragAndDrop,
  dragAndDrop,
} from '@minddrop/drag-and-drop/test-utils';
import { cleanup as cleanupRender, render } from '@minddrop/test-utils';
import { CanvasProvider } from '@minddrop/ui-canvas';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import {
  DesignElementTemplatesDataKey,
  DesignLayoutTypesDataKey,
} from '../constants';
import { cleanup, setup } from '../test-utils';
import { DesignStudioViewport } from './DesignStudioViewport';

const { design_books } = DesignFixtures;

describe('<DesignStudioViewport />', () => {
  beforeEach(setup);

  afterEach(async () => {
    cleanupRender();
    cleanupDragAndDrop();
    await cleanup();
  });

  it('creates a layout of the type dropped onto it', async () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    const { container, getByTestId } = renderViewport(studio, {
      [DesignLayoutTypesDataKey]: [{ layoutType: 'card' }],
    });

    dragAndDrop(getByTestId('drag-source'), dropTarget(container));

    await vi.waitFor(() => {
      expect(getLayouts(studio)).toHaveLength(design_books.layouts.length + 1);
    });
  });

  it('leaves drops of anything but a layout type alone', async () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    const { container, getByTestId } = renderViewport(studio, {
      [DesignElementTemplatesDataKey]: [{ type: 'text' }],
    });

    dragAndDrop(getByTestId('drag-source'), dropTarget(container));

    // Give a wrongly taken drop the time a layout creation takes
    await new Promise((resolve) => setTimeout(resolve));

    expect(getLayouts(studio)).toHaveLength(design_books.layouts.length);
  });
});

/**
 * Renders the viewport within the studio and canvas providers,
 * alongside a drag source with the given data.
 *
 * @param studio - The design studio store.
 * @param dragData - The drag source's data.
 * @returns The render result.
 */
function renderViewport(
  studio: DesignStudioStore,
  dragData: Record<string, unknown>,
) {
  return render(
    <DesignStudioProvider store={studio}>
      <CanvasProvider>
        <DragSource data={dragData} />
        <DesignStudioViewport name="Design" onNameChange={() => undefined} />
      </CanvasProvider>
    </DesignStudioProvider>,
  );
}

/**
 * Returns the layouts of the studio's design.
 *
 * @param studio - The design studio store.
 * @returns The design's layouts.
 */
function getLayouts(studio: DesignStudioStore) {
  // Read the studio's design
  const design = studio.getDesign();

  if (!design) {
    throw new Error('The studio has no design');
  }

  return design.layouts;
}

/**
 * Returns the element taking drops for the viewport.
 *
 * @param container - The rendered container.
 * @returns The drop target element.
 */
function dropTarget(container: HTMLElement): HTMLElement {
  return container.querySelector(
    '.designs-studio-viewport-drop-target',
  ) as HTMLElement;
}
