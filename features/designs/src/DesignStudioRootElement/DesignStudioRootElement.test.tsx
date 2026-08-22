import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Design, Layout } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
} from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { LayoutIdProvider } from '../LayoutIdContext';
import { EmptyElementMinSize } from '../constants';
import { cleanup, setup } from '../test-utils';
import { FlatRootDesignElement } from '../types';
import { DesignStudioRootElement } from './DesignStudioRootElement';

const { design_books, layout_card_1, element_container_1, element_text_1 } =
  DesignFixtures;

describe('<DesignStudioRootElement />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('holds an empty layout open as a drop target', () => {
    // A card layout with nothing in its root. Card frames size to
    // their content, so an unheld root would collapse to nothing.
    const emptyLayout: Layout = {
      ...layout_card_1,
      tree: { ...layout_card_1.tree, children: [] },
    };

    const studio = createDesignStudioStore();

    studio.initialize(withLayout(design_books, emptyLayout));

    const { container } = renderRoot(studio, emptyLayout.id);

    // The root is held open at the empty element minimum size
    const root = container.querySelector('.designs-studio-root-element');

    expect(root).not.toBeNull();
    expect((root as HTMLElement).style.minHeight).toBe(
      `${EmptyElementMinSize}px`,
    );
  });

  it('leaves the height of an empty layout which sets one', () => {
    // An empty card layout with a floor of its own, which is what
    // keeps it open once it holds content too
    const boundedLayout: Layout = {
      ...layout_card_1,
      tree: {
        ...layout_card_1.tree,
        children: [],
        style: { minHeight: 'lg' },
      },
    };

    const studio = createDesignStudioStore();

    studio.initialize(withLayout(design_books, boundedLayout));

    const { container } = renderRoot(studio, boundedLayout.id);

    const root = container.querySelector('.designs-studio-root-element');

    // The placeholder size does not stand in for a floor the
    // layout already has
    expect((root as HTMLElement).style.minHeight).toBe('var(--size-lg)');
  });

  it('renders the drop hint in an empty layout', () => {
    const emptyLayout: Layout = {
      ...layout_card_1,
      tree: { ...layout_card_1.tree, children: [] },
    };

    const studio = createDesignStudioStore();

    studio.initialize(withLayout(design_books, emptyLayout));

    const { container } = renderRoot(studio, emptyLayout.id);

    expect(container.querySelector('.designs-empty-drop-hint')).not.toBeNull();
  });

  it('does not hold open or hint a layout with elements', () => {
    const studio = createDesignStudioStore();

    studio.initialize(withLayout(design_books, layout_card_1));

    const { container } = renderRoot(studio, layout_card_1.id);

    const root = container.querySelector('.designs-studio-root-element');

    // A populated root is sized by its elements
    expect((root as HTMLElement).style.minHeight).toBe('');
    expect(container.querySelector('.designs-empty-drop-hint')).toBeNull();
  });

  it('shift-clicking an element selects its parent', () => {
    const studio = createDesignStudioStore();

    studio.initialize(withLayout(design_books, layout_card_1));

    const { container } = renderRoot(studio, layout_card_1.id);

    // The text element nested inside the layout's container
    const textElement = container.querySelector(
      `[data-element-id="${element_text_1.id}"]`,
    ) as HTMLElement;

    // A plain click selects the element itself
    fireEvent.click(textElement);

    expect(studio.getSelectedElementId()).toBe(element_text_1.id);

    // A shift-click selects the containing element instead
    fireEvent.click(textElement, { shiftKey: true });

    expect(studio.getSelectedElementId()).toBe(element_container_1.id);

    // Repeated shift-clicks keep climbing towards the root
    fireEvent.click(textElement, { shiftKey: true });

    expect(studio.getSelectedElementId()).toBe('root');

    // The root is the end of the chain, so the selection stays put
    fireEvent.click(textElement, { shiftKey: true });

    expect(studio.getSelectedElementId()).toBe('root');
  });
});

/**
 * Returns the design with its layouts replaced by the given layout.
 */
function withLayout(design: Design, layout: Layout): Design {
  return { ...design, layouts: [layout] };
}

/**
 * Renders the studio root element of a layout within the studio
 * and layout providers.
 */
function renderRoot(studio: DesignStudioStore, layoutId: string) {
  const rootElement = studio.getElements(layoutId)
    .root as FlatRootDesignElement;

  return render(
    <DesignStudioProvider store={studio}>
      <LayoutIdProvider value={layoutId}>
        <DesignStudioRootElement element={rootElement} />
      </LayoutIdProvider>
    </DesignStudioProvider>,
  );
}
