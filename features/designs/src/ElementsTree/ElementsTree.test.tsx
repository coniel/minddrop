import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  Designs,
  Layout,
  RoleDesignElement,
  TextElement,
} from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { DragAndDrop } from '@minddrop/drag-and-drop';
import {
  DragGestureOptions,
  DragSource,
  cleanup as cleanupDragAndDrop,
  dragAndDrop,
  dragOver,
} from '@minddrop/drag-and-drop/test-utils';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  createDesignStudioStore,
} from '../DesignStudioStore';
import {
  DesignElementTemplatesDataKey,
  DesignElementsDataKey,
} from '../constants';
import { cleanup, setup } from '../test-utils';
import { FlatParentDesignElement } from '../types';
import { ElementsTree } from './ElementsTree';

const {
  design_books,
  layout_card_1,
  layout_page_1,
  element_text_1,
  element_container_1,
} = DesignFixtures;

describe('<ElementsTree />', () => {
  beforeEach(setup);

  afterEach(async () => {
    cleanupRender();
    cleanupDragAndDrop();
    await cleanup();
  });

  it('renders nothing when no layout is being edited', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    const { container } = render(
      <DesignStudioProvider store={studio}>
        <ElementsTree />
      </DesignStudioProvider>,
    );

    expect(container.querySelector('.designs-elements-tree')).toBeNull();
  });

  it('labels the root node with the layout type name', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    renderTree(studio, layout_card_1.id);

    screen.getByText('designs.layouts.card.name');
  });

  it('names role elements after their role and chips their binding', () => {
    // A text element playing the heading role, bound to a property
    const roleElement: RoleDesignElement<TextElement> = {
      ...element_text_1,
      id: 'role-element',
      role: 'heading',
      property: 'Title',
    };

    const studio = createDesignStudioStore();

    studio.initialize(withElement(layout_card_1, roleElement, design_books));

    const { container } = renderTree(studio, layout_card_1.id);

    // The node takes the role's label, not the element type's. The
    // label and the chipped binding are matched within their own
    // spans.
    const labels = Array.from(
      container.querySelectorAll('.designs-elements-tree-node-label'),
    ).map((label) => label.textContent);
    const properties = Array.from(
      container.querySelectorAll('.designs-elements-tree-node-property'),
    ).map((property) => property.textContent);

    expect(labels).toContain('Heading');

    // The bound property is chipped after the label
    expect(properties).toContain('Title');
  });

  it('renders static content without a binding arrow', () => {
    const staticElement: TextElement = {
      ...element_text_1,
      id: 'static-element',
      static: true,
      content: 'Static value',
    };

    const studio = createDesignStudioStore();

    studio.initialize(withElement(layout_card_1, staticElement, design_books));

    const { container } = renderTree(studio, layout_card_1.id);

    // The static content is displayed as plain text
    const staticNode = screen.getByText('Static value');

    expect(staticNode.className).toContain('designs-elements-tree-node-static');

    // No property chip is rendered for static elements
    expect(
      container.querySelector('.designs-elements-tree-node-property'),
    ).toBeNull();
  });

  it('selects a node on click, and folds it away once selected', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    renderTree(studio, layout_card_1.id);

    // The container node, which holds the layout's nested element
    const containerNode = screen
      .getByText('design-studio.elements.container')
      .closest('.designs-elements-tree-node') as HTMLElement;

    fireEvent.click(containerNode);

    // The first click selects rather than collapsing
    expect(studio.getSelectedElementId()).toBe(element_container_1.id);
    expect(isExpanded(containerNode)).toBe(true);

    fireEvent.click(containerNode);

    // The second click folds the node away, leaving it selected
    expect(studio.getSelectedElementId()).toBe(element_container_1.id);
    expect(isExpanded(containerNode)).toBe(false);
  });

  it('drags a node as its element', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    renderTree(studio, layout_card_1.id);

    const containerNode = screen
      .getByText('design-studio.elements.container')
      .closest('.designs-elements-tree-node') as HTMLElement;

    // Pick the node up
    dragOver(containerNode, document.body);

    expect(DragAndDrop.getActiveDrag()).toEqual(
      expect.objectContaining({ id: element_container_1.id }),
    );
    expect(containerNode).toHaveAttribute('data-dragging', 'true');
  });

  it('leaves the layout root undraggable', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    const { container } = renderTree(studio, layout_card_1.id);

    // The root is placed by the layout, not by the user
    const rootNode = container.querySelector(
      '.designs-elements-tree-node',
    ) as HTMLElement;

    // Try to pick the root up
    dragOver(rootNode, document.body);

    expect(DragAndDrop.getActiveDrag()).toBeNull();
  });

  it('inserts a dropped element template into the layout root', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    const { container } = renderTree(studio, layout_card_1.id);

    const rootNode = container.querySelector(
      '.designs-elements-tree-node',
    ) as HTMLElement;

    dropOnNode(rootNode, {
      [DesignElementTemplatesDataKey]: [Designs.elementConfigs.Text.template],
    });

    const root = studio.getDesignElement<FlatParentDesignElement>(
      'root',
      layout_card_1.id,
    );

    // The template is appended after the layout's existing elements
    expect(root.children.length).toBe(layout_card_1.tree.children.length + 1);
  });

  it('ignores drops on the root node of a panelled root', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);
    studio.setActiveLayout(layout_page_1.id);

    // Dock a panel, which limits content to the panel regions
    studio.addPagePanel('left');

    const { container } = renderTree(studio, layout_page_1.id);

    const rootNode = container.querySelector(
      '.designs-elements-tree-node',
    ) as HTMLElement;

    dropOnNode(rootNode, {
      [DesignElementTemplatesDataKey]: [Designs.elementConfigs.Text.template],
    });

    const root = studio.getDesignElement<FlatParentDesignElement>(
      'root',
      layout_page_1.id,
    );

    // Content can only be dropped inside the panel regions, so the
    // root's children are unchanged.
    expect(
      root.children.every(
        (childId) =>
          studio.getDesignElement(childId, layout_page_1.id)?.type !== 'text',
      ),
    ).toBe(true);
  });

  it('moves an element dropped onto a sibling node', () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    renderTree(studio, layout_card_1.id);

    // The static text node, the root's last child
    const targetNode = screen
      .getByText(layout_card_1.id)
      .closest('.designs-elements-tree-node') as HTMLElement;

    // Drop on the lower half of the node. The element lands below it.
    dropOnNode(
      targetNode,
      {
        [DesignElementsDataKey]: [
          studio.getDesignElement(element_container_1.id, layout_card_1.id),
        ],
      },
      { clientX: 50, clientY: 90 },
    );

    const root = studio.getDesignElement<FlatParentDesignElement>(
      'root',
      layout_card_1.id,
    );

    // The dragged container is sorted below the node it was
    // dropped on.
    expect(root.children[1]).toBe(element_container_1.id);
  });

  it('renders a drop zone for containers without children', () => {
    const studio = createDesignStudioStore();

    studio.initialize({ ...design_books, layouts: [emptyLayout()] });

    renderTree(studio, layout_card_1.id);

    screen.getByText('designsStudio.tree.dropHint');
  });

  it('adds dropped elements to the empty container', () => {
    const studio = createDesignStudioStore();

    studio.initialize({ ...design_books, layouts: [emptyLayout()] });

    const { container } = renderTree(studio, layout_card_1.id);

    const dropZone = container.querySelector(
      '.designs-elements-tree-drop-zone',
    ) as HTMLElement;

    dropOnNode(dropZone, {
      [DesignElementTemplatesDataKey]: [Designs.elementConfigs.Text.template],
    });

    const root = studio.getDesignElement<FlatParentDesignElement>(
      'root',
      layout_card_1.id,
    );

    // The dropped element becomes the container's only child
    expect(root.children.length).toBe(1);
  });
});

/**
 * Returns the card layout with an empty root.
 */
function emptyLayout(): Layout {
  return {
    ...layout_card_1,
    tree: { ...layout_card_1.tree, children: [] },
  };
}

/**
 * Whether a node's children are shown, read from the disclosure
 * state its chevron carries.
 */
function isExpanded(node: HTMLElement): boolean {
  const trigger = node.querySelector(
    '.designs-elements-tree-node-chevron-trigger',
  );

  return !!trigger?.hasAttribute('data-panel-open');
}

/**
 * Drags the given design studio drag data onto the node and drops
 * it there.
 *
 * @param node - The tree node to drop on.
 * @param data - The drag data.
 * @param options - The drag gesture options.
 */
function dropOnNode(
  node: HTMLElement,
  data: Record<string, unknown>,
  options?: DragGestureOptions,
) {
  // Render a drag source with the data
  const { getByTestId } = render(<DragSource data={data} />);

  // Drag the source onto the node and drop it
  dragAndDrop(getByTestId('drag-source'), node, options);
}

/**
 * Renders the tree of the given layout within the given studio
 * instance.
 */
function renderTree(
  studio: ReturnType<typeof createDesignStudioStore>,
  layoutId: string,
) {
  studio.setActiveLayout(layoutId);

  return render(
    <DesignStudioProvider store={studio}>
      <ElementsTree />
    </DesignStudioProvider>,
  );
}

/**
 * Returns the design with the layout's root holding only the given
 * element.
 */
function withElement(
  layout: Layout,
  element: TextElement | RoleDesignElement<TextElement>,
  design: typeof design_books,
) {
  return {
    ...design,
    layouts: [{ ...layout, tree: { ...layout.tree, children: [element] } }],
  };
}
