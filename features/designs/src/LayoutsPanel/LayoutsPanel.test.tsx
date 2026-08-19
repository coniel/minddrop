import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures, TextElementConfig } from '@minddrop/designs';
import { toMimeType } from '@minddrop/selection';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { DesignElementTemplatesDataKey } from '../constants';
import { cleanup, setup } from '../test-utils';
import { FlatParentDesignElement } from '../types';
import { LayoutsPanel } from './LayoutsPanel';

const { design_books, design_empty, layout_card_1, layout_page_1 } =
  DesignFixtures;

describe('<LayoutsPanel />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  describe('with no active layout', () => {
    it('lists the design layouts alongside the layout types', () => {
      const studio = createDesignStudioStore();

      studio.initialize(design_books);

      renderPanel(studio);

      // Each of the design's layouts is listed by name
      design_books.layouts.forEach((layout) => {
        screen.getByText(layout.name);
      });

      // The layout types which can be added are offered above them
      screen.getByText('designs.layouts.card.label');
    });

    it('renders an empty state for designs without layouts', () => {
      const studio = createDesignStudioStore();

      studio.initialize(design_empty);

      renderPanel(studio);

      screen.getByText('designs.layouts.empty');
    });

    it('opens the clicked layout', () => {
      const studio = createDesignStudioStore();

      studio.initialize(design_books);

      renderPanel(studio);

      fireEvent.click(screen.getByText(layout_card_1.name));

      expect(studio.getActiveLayoutId()).toBe(layout_card_1.id);
    });
  });

  describe('with an active layout', () => {
    it('renders the layout tree and its compatible elements', () => {
      const studio = createDesignStudioStore();

      studio.initialize(design_books);
      studio.setActiveLayout(layout_card_1.id);

      renderPanel(studio);

      // The tree is rooted at the layout type's name
      screen.getByText('designs.layouts.card.name');

      // The palette offers the roles of the active layout type
      screen.getByText('designsStudio.palette.elements.card');
    });

    it('appends elements dropped below the tree to the root', () => {
      const studio = createDesignStudioStore();

      studio.initialize(design_books);
      studio.setActiveLayout(layout_card_1.id);

      const { container } = renderPanel(studio);

      // The region below the tree, wrapping the elements palette
      const zone = container.querySelector(
        '.designs-root-append-zone-target',
      ) as HTMLElement;

      dropOnZone(zone, {
        [DesignElementTemplatesDataKey]: [TextElementConfig.template],
      });

      const root = studio.getDesignElement<FlatParentDesignElement>(
        'root',
        layout_card_1.id,
      );

      // The dropped element is added after the root's existing
      // children
      expect(root.children.length).toBe(layout_card_1.tree.children.length + 1);
    });

    it('offers no append strip on a panelled root', () => {
      const studio = createDesignStudioStore();

      studio.initialize(design_books);
      studio.setActiveLayout(layout_page_1.id);

      // Dock a panel, which limits content to the panel regions
      studio.addPagePanel('left');

      const { container } = renderPanel(studio);

      // With no valid end-of-root drop to offer, the strip is gone
      expect(
        container.querySelector('.designs-root-append-zone-target'),
      ).toBeNull();
    });
  });
});

/**
 * Fires a drop event on the given element carrying the given data
 * keys, serialized the way a native drag would carry them.
 */
function dropOnZone(zone: HTMLElement, data: Record<string, unknown>) {
  const serialized = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      toMimeType(key),
      JSON.stringify(value),
    ]),
  );

  fireEvent.drop(zone, {
    dataTransfer: {
      types: Object.keys(serialized),
      getData: (type: string) => serialized[type] || '',
      files: { length: 0 },
    },
  });
}

/**
 * Renders the layouts panel within the studio provider.
 */
function renderPanel(studio: DesignStudioStore) {
  return render(
    <DesignStudioProvider store={studio}>
      <LayoutsPanel />
    </DesignStudioProvider>,
  );
}
