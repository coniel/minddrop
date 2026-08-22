import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ContainerElementConfig,
  Designs,
  IconElementConfig,
  ImageElementConfig,
  Layout,
  RoleDesignElement,
  TextElement,
  TextElementConfig,
  UrlElementConfig,
  resolveDesignMediaDirPath,
} from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { cleanup, setup } from '../test-utils';
import {
  FlatContainerDesignElement,
  FlatParentDesignElement,
  FlatTextElement,
} from '../types';
import { flattenTree } from '../utils';
import {
  DesignStudioStore,
  createDesignStudioStore,
} from './DesignStudioStore';

const {
  design_books,
  designProperties,
  layout_card_1,
  layout_list_1,
  layout_page_1,
  element_container_1,
  element_container_2,
  element_text_1,
  element_text_2,
} = DesignFixtures;

const MEDIA_DIR_PATH = 'workspace/.minddrop/spaces/space_1/media';

// A card layout with nothing in its root, so auto-binding tests
// start with every design property unbound
const emptyCardLayout: Layout = {
  ...layout_card_1,
  tree: { ...layout_card_1.tree, children: [] },
};

describe('DesignStudioStore', () => {
  let studio: DesignStudioStore;

  beforeEach(() => {
    setup();

    // Each test gets its own store instance
    studio = createDesignStudioStore();
  });

  afterEach(cleanup);

  /**
   * Initializes the studio with the books design and activates
   * its card layout.
   */
  function initializeWithActiveCardLayout() {
    studio.initialize(design_books, designProperties);
    studio.setActiveLayout(layout_card_1.id);
  }

  it('initializes the store', () => {
    studio.initialize(design_books, designProperties);

    // Sets initialized to true
    expect(studio.isInitialized()).toBe(true);
    // Sets the design
    expect(studio.getDesign()).toEqual(design_books);
    // Flattens each layout's tree into its own bucket
    expect(studio.getElementsByLayout()).toEqual({
      [layout_card_1.id]: flattenTree(layout_card_1.tree),
      [layout_list_1.id]: flattenTree(layout_list_1.tree),
      [layout_page_1.id]: flattenTree(layout_page_1.tree),
    });
    // No layout is active until one is selected
    expect(studio.getActiveLayoutId()).toBeNull();
    // Sets the properties
    expect(studio.getProperties()).toEqual(designProperties);
    // Media resolves against the design's media directory
    expect(studio.getMediaDirPath()).toBe(
      resolveDesignMediaDirPath(design_books.id),
    );
  });

  it('scopes state to the instance', () => {
    // Initialize one instance, leave a second untouched
    const other = createDesignStudioStore();

    studio.initialize(design_books);

    // The second instance is unaffected
    expect(other.isInitialized()).toBe(false);
    expect(other.getDesign()).toBeNull();
  });

  it('activates a layout and selects its root element', () => {
    studio.initialize(design_books);

    studio.setActiveLayout(layout_card_1.id);

    expect(studio.getActiveLayoutId()).toBe(layout_card_1.id);
    expect(studio.getSelectedElementId()).toBe('root');

    // Clearing the active layout clears the selection
    studio.setActiveLayout(null);

    expect(studio.getActiveLayoutId()).toBeNull();
    expect(studio.getSelectedElementId()).toBeNull();
  });

  it('updates elements by deeply merging the updates', () => {
    initializeWithActiveCardLayout();

    // Update an element's style
    studio.updateElement(element_text_1.id, {
      style: { fontFamily: 'mono' },
    });

    // Update the same element's style again with another key
    studio.updateElement(element_text_1.id, {
      style: { fontWeight: 'bold' },
    });

    // Both style keys are present after the merges
    expect(studio.getElements(layout_card_1.id)[element_text_1.id]).toEqual({
      ...flattenTree(layout_card_1.tree)[element_text_1.id],
      style: { fontFamily: 'mono', fontWeight: 'bold' },
    });
  });

  it('preserves role fields through element updates', () => {
    initializeWithActiveCardLayout();

    // Give the element a role with variants
    const roleElement: RoleDesignElement<TextElement> & { parent: string } = {
      ...studio.getDesignElement<FlatTextElement>(element_text_1.id),
      role: 'title',
      roleVariants: { size: 'lg' },
    };
    studio.replaceElement(element_text_1.id, roleElement);

    // Deep-merge an unrelated update
    studio.updateElement(element_text_1.id, {
      style: { fontFamily: 'mono' },
    });

    // The role fields survive the merge
    expect(studio.getDesignElement(element_text_1.id)).toMatchObject({
      role: 'title',
      roleVariants: { size: 'lg' },
    });
  });

  it('does not affect other layouts when mutating shared element IDs', () => {
    initializeWithActiveCardLayout();

    // The list layout contains an element with the same ID
    const listElementsBefore = studio.getElements(layout_list_1.id);

    studio.updateElement(element_text_1.id, {
      style: { fontFamily: 'mono' },
    });

    // The list layout's bucket is untouched
    expect(studio.getElements(layout_list_1.id)).toEqual(listElementsBefore);
  });

  it('adds elements to the active layout only', () => {
    initializeWithActiveCardLayout();

    // Snapshot the list layout's bucket before the add
    const listElementsBefore = studio.getElements(layout_list_1.id);

    // Add a new element to the active card layout's root
    const newElement: FlatTextElement = {
      ...TextElementConfig.template,
      id: 'added-element',
      parent: 'root',
    };
    studio.addElement(newElement, 'root', 0);

    // The new element lands in the card layout's bucket
    expect(studio.getElements(layout_card_1.id)['added-element']).toEqual(
      newElement,
    );
    // The list layout's bucket is untouched
    expect(studio.getElements(layout_list_1.id)).toEqual(listElementsBefore);
  });

  it('moves an element to a new parent and rewires its parent link', () => {
    initializeWithActiveCardLayout();

    // Move the container's text child up into the root
    studio.moveElement(element_text_1.id, 'root', 0);

    const elements = studio.getElements(layout_card_1.id);
    const root = elements.root as FlatContainerDesignElement;
    const container = elements[
      element_container_1.id
    ] as FlatContainerDesignElement;

    // The root gains the element at the target index
    expect(root.children[0]).toBe(element_text_1.id);
    // The old parent loses the element
    expect(container.children).not.toContain(element_text_1.id);
    // The element points at its new parent
    expect(elements[element_text_1.id]).toMatchObject({ parent: 'root' });
  });

  it('repositions an element moved within its current parent', () => {
    initializeWithActiveCardLayout();

    const before = (
      studio.getElements(layout_card_1.id).root as FlatContainerDesignElement
    ).children;

    // Move a root child to the front of the parent it already
    // lives in
    studio.moveElement(element_text_2.id, 'root', 0);

    const root = studio.getElements(layout_card_1.id)
      .root as FlatContainerDesignElement;

    // The element moves rather than being duplicated
    expect(root.children).toEqual([element_text_2.id, ...before.slice(0, -1)]);
  });

  it('sorts an element within its parent', () => {
    initializeWithActiveCardLayout();

    const rootBefore = studio.getElements(layout_card_1.id)
      .root as FlatContainerDesignElement;

    // Move the first root child to the end
    studio.sortElement(rootBefore.children[0], 1);

    const rootAfter = studio.getElements(layout_card_1.id)
      .root as FlatContainerDesignElement;

    expect(rootAfter.children).toEqual([
      rootBefore.children[1],
      rootBefore.children[0],
    ]);
  });

  it('removes an element and detaches it from its parent', () => {
    initializeWithActiveCardLayout();

    studio.removeElement(element_text_1.id);

    const elements = studio.getElements(layout_card_1.id);

    // The element is gone from the bucket
    expect(elements[element_text_1.id]).toBeUndefined();
    // The parent's children no longer reference it
    expect(
      (elements[element_container_1.id] as FlatContainerDesignElement).children,
    ).not.toContain(element_text_1.id);
  });

  it('selects, highlights and clears highlights', () => {
    initializeWithActiveCardLayout();

    studio.selectElement(element_text_1.id);

    expect(studio.getSelectedElementId()).toBe(element_text_1.id);
    expect(studio.getHighlightedElementId()).toBe(element_text_1.id);

    // Clearing moves the highlight into its fade-out phase
    studio.clearHighlight();

    expect(studio.getHighlightedElementId()).toBeNull();
    expect(studio.getFadingHighlightElementId()).toBe(element_text_1.id);

    // Clearing the fade ends the animation state
    studio.clearFadingHighlight();

    expect(studio.getFadingHighlightElementId()).toBeNull();
  });

  it('resets the store', () => {
    initializeWithActiveCardLayout();

    studio.clear();

    expect(studio.isInitialized()).toBe(false);
    expect(studio.getDesign()).toBeNull();
    expect(studio.getElementsByLayout()).toEqual({});
  });

  it('saves the design by reconstructing every layout tree', async () => {
    initializeWithActiveCardLayout();

    // Mutate an element in the active card layout
    studio.updateElement(element_text_1.id, {
      style: { fontFamily: 'mono' },
    });

    // Switch to the list layout and mutate an element there
    studio.setActiveLayout(layout_list_1.id);
    studio.updateElement(element_text_2.id, {
      style: { fontWeight: 'bold' },
    });

    await studio.saveDesign();

    // Read the persisted design back and flatten both mutated layouts
    const saved = Designs.get(design_books.id);
    const cardElements = flattenTree(
      saved.layouts.find((layout) => layout.id === layout_card_1.id)!.tree,
    );
    const listElements = flattenTree(
      saved.layouts.find((layout) => layout.id === layout_list_1.id)!.tree,
    );

    // The card layout's tree reflects the font family change
    expect(cardElements[element_text_1.id]).toMatchObject({
      style: { fontFamily: 'mono' },
    });
    // The list layout's tree reflects the font weight change
    expect(listElements[element_text_2.id]).toMatchObject({
      style: { fontWeight: 'bold' },
    });
    // The list layout mutation did not leak into the card layout
    expect(cardElements[element_text_2.id]).not.toMatchObject({
      style: { fontWeight: 'bold' },
    });
  });

  it('renames the design', async () => {
    studio.initialize(design_books);

    await studio.renameDesign('Novels');

    // The store snapshot and persisted design are renamed
    expect(studio.getDesign()?.name).toBe('Novels');
    expect(Designs.get(design_books.id).name).toBe('Novels');
  });

  it('sets and unsets element style keys', async () => {
    initializeWithActiveCardLayout();

    // Set a style key
    studio.updateElementStyle(element_text_1.id, 'fontFamily', 'mono');

    expect(studio.getDesignElement(element_text_1.id).style).toEqual({
      fontFamily: 'mono',
    });

    // Unset the key
    studio.updateElementStyle(element_text_1.id, 'fontFamily', undefined);

    // The key is removed outright rather than set to undefined
    expect(
      'fontFamily' in studio.getDesignElement(element_text_1.id).style,
    ).toBe(false);
  });

  describe('properties', () => {
    it('adds a property to the design', async () => {
      studio.initialize(design_books);

      await studio.addDesignProperty({ type: 'number', name: 'Pages' });

      // The snapshot contains the new property
      expect(studio.getDesignProperty('Pages')).toEqual({
        type: 'number',
        name: 'Pages',
      });
    });

    it('renames a property and rebinds bound elements', async () => {
      initializeWithActiveCardLayout();

      // Bind an element to the property
      studio.updateElement(element_text_1.id, { property: 'Subtitle' });

      await studio.renameDesignProperty('Subtitle', 'Tagline');

      // The design property is renamed
      expect(studio.getDesignProperty('Subtitle')).toBeNull();
      expect(studio.getDesignProperty('Tagline')).not.toBeNull();
      // The bound element follows the rename
      expect(studio.getDesignElement(element_text_1.id)).toMatchObject({
        property: 'Tagline',
      });
    });

    it('removes a property and unbinds bound elements', async () => {
      initializeWithActiveCardLayout();

      // Bind an element to the property
      studio.updateElement(element_text_1.id, { property: 'Subtitle' });

      await studio.removeDesignProperty('Subtitle');

      // The design property is removed
      expect(studio.getDesignProperty('Subtitle')).toBeNull();
      // The bound element is unbound
      expect(
        studio.getDesignElement(element_text_1.id).property,
      ).toBeUndefined();
    });

    it('updates a property', async () => {
      studio.initialize(design_books);

      await studio.updateDesignProperty({
        type: 'text',
        name: 'Subtitle',
        placeholder: 'A catchy subtitle',
      });

      expect(studio.getDesignProperty('Subtitle')).toMatchObject({
        placeholder: 'A catchy subtitle',
      });
    });
  });

  describe('layouts', () => {
    it('adds a layout and makes it active', async () => {
      studio.initialize(design_books);

      const layout = await studio.addLayout(design_books.id, 'card', {
        x: 100,
        y: 200,
      });

      // The layout's elements are flattened into the store
      expect(studio.getElements(layout.id)).toEqual(flattenTree(layout.tree));
      // The layout becomes active with its root selected
      expect(studio.getActiveLayoutId()).toBe(layout.id);
      expect(studio.getSelectedElementId()).toBe('root');
      // The frame is positioned as requested
      expect(layout.frame).toMatchObject({ x: 100, y: 200 });
    });

    it('removes a layout and clears it from the store', async () => {
      initializeWithActiveCardLayout();

      await studio.removeLayout(layout_card_1.id);

      // The layout's bucket is dropped
      expect(studio.getElementsByLayout()).not.toHaveProperty(layout_card_1.id);
      // The active layout is cleared since it was removed
      expect(studio.getActiveLayoutId()).toBeNull();
      // The layout is removed from the persisted design
      expect(
        Designs.get(design_books.id).layouts.some(
          (layout) => layout.id === layout_card_1.id,
        ),
      ).toBe(false);
    });

    it('updates a layout frame', async () => {
      studio.initialize(design_books);

      await studio.updateLayoutFrame(layout_card_1.id, {
        x: 10,
        y: 20,
        width: 400,
      });

      // The snapshot reflects the new frame
      expect(
        studio
          .getDesign()
          ?.layouts.find((layout) => layout.id === layout_card_1.id)?.frame,
      ).toEqual({ x: 10, y: 20, width: 400 });
    });

    it('renames a layout', async () => {
      studio.initialize(design_books);

      await studio.renameLayout(layout_card_1.id, 'Compact card');

      expect(
        studio
          .getDesign()
          ?.layouts.find((layout) => layout.id === layout_card_1.id)?.name,
      ).toBe('Compact card');
    });
  });

  describe('layout editor session', () => {
    it('initializes the editor with a single active layout', () => {
      studio.initializeLayoutEditor(layout_page_1, {
        onSave: () => {},
        mediaDirPath: MEDIA_DIR_PATH,
      });

      // The layout is flattened and active with its root selected
      expect(studio.getElements(layout_page_1.id)).toEqual(
        flattenTree(layout_page_1.tree),
      );
      expect(studio.getActiveLayoutId()).toBe(layout_page_1.id);
      expect(studio.getSelectedElementId()).toBe('root');

      // Property binding defaults to disabled
      expect(studio.isPropertyBindingEnabled()).toBe(false);

      // Media resolves against the owner's media directory
      expect(studio.getMediaDirPath()).toBe(MEDIA_DIR_PATH);
    });

    it('persists edits through the save handler', async () => {
      // Capture the layout saved through the handler
      let savedLayout: Layout | undefined;

      studio.initializeLayoutEditor(layout_page_1, {
        onSave: (layout) => {
          savedLayout = layout;
        },
        mediaDirPath: MEDIA_DIR_PATH,
      });

      // Mutate an element and save
      studio.updateElement(element_text_1.id, {
        style: { fontFamily: 'mono' },
      });

      await studio.saveDesign();

      // The handler received the reconstructed layout
      expect(flattenTree(savedLayout!.tree)[element_text_1.id]).toMatchObject({
        style: { fontFamily: 'mono' },
      });

      // The synthetic design was not persisted to the designs store
      const syntheticId = studio.getDesign()!.id;

      expect(Designs.get(syntheticId, false)).toBeNull();
    });

    it('forces added content elements into static mode', () => {
      studio.initializeLayoutEditor(layout_page_1, {
        onSave: () => {},
        mediaDirPath: MEDIA_DIR_PATH,
      });

      // Add a text and an icon element from their templates
      studio.addDesignElementFromTemplate(
        TextElementConfig.template,
        'root',
        0,
      );
      studio.addDesignElementFromTemplate(
        IconElementConfig.template,
        'root',
        1,
      );

      // Resolve the added elements through the root's children
      const root = studio.getDesignElement<FlatParentDesignElement>('root');
      const elements = studio.getElements(layout_page_1.id);

      // Content elements start in static mode
      expect(elements[root.children[0]]).toMatchObject({
        type: 'text',
        static: true,
      });

      // Icon elements receive a default static icon
      expect(elements[root.children[1]]).toMatchObject({
        type: 'icon',
        static: true,
        icon: 'content-icon:cat:default',
      });
    });

    it('clears the editor session', () => {
      studio.initializeLayoutEditor(layout_page_1, {
        onSave: () => {},
        mediaDirPath: MEDIA_DIR_PATH,
      });

      studio.clearLayoutEditor();

      // The session state is reset
      expect(studio.isInitialized()).toBe(false);
      expect(studio.getSaveHandler()).toBeNull();
      expect(studio.isPropertyBindingEnabled()).toBe(true);
      expect(studio.getMediaDirPath()).toBeNull();
    });
  });

  describe('deleteHighlightedElement', () => {
    it('deletes the highlighted element', () => {
      initializeWithActiveCardLayout();

      // Highlight an element
      studio.selectElement(element_text_1.id);

      studio.deleteHighlightedElement();

      // The element is removed from the layout
      expect(
        studio.getElements(layout_card_1.id)[element_text_1.id],
      ).toBeUndefined();
    });

    it('does not delete the layout root unless allowed', () => {
      initializeWithActiveCardLayout();

      // Highlight the root element
      studio.selectElement('root');

      studio.deleteHighlightedElement();

      // The layout remains intact
      expect(studio.getElementsByLayout()).toHaveProperty(layout_card_1.id);
      expect(
        Designs.get(design_books.id).layouts.some(
          (layout) => layout.id === layout_card_1.id,
        ),
      ).toBe(true);
    });
  });

  describe('auto-binding elements added from a template', () => {
    /**
     * Returns the element most recently added to the card layout's
     * root, which is always inserted at index 0 by these tests.
     */
    function getAddedElement() {
      const root = studio.getDesignElement<FlatParentDesignElement>('root');

      return studio.getDesignElement(root.children[0]);
    }

    it('binds a URL element to the design URL property', () => {
      // The standard fixture design has no URL property, so add one
      const design = {
        ...design_books,
        properties: [
          ...designProperties,
          { type: 'url' as const, name: 'Website' },
        ],
        layouts: [emptyCardLayout],
      };

      studio.initialize(design, design.properties);
      studio.setActiveLayout(emptyCardLayout.id);

      studio.addDesignElementFromTemplate(UrlElementConfig.template, 'root', 0);

      expect(getAddedElement().property).toBe('Website');
    });

    it('binds to the first compatible property in priority order', () => {
      studio.initialize(
        { ...design_books, layouts: [emptyCardLayout] },
        designProperties,
      );
      studio.setActiveLayout(emptyCardLayout.id);

      studio.addDesignElementFromTemplate(
        TextElementConfig.template,
        'root',
        0,
      );

      // Text elements list 'title' ahead of 'text', so the title
      // property wins over the text properties
      expect(getAddedElement().property).toBe('Title');
    });

    it('leaves containers unbound so they do not claim a property', () => {
      studio.initialize(
        { ...design_books, layouts: [emptyCardLayout] },
        designProperties,
      );
      studio.setActiveLayout(emptyCardLayout.id);

      studio.addDesignElementFromTemplate(
        ContainerElementConfig.template,
        'root',
        0,
      );

      // Containers accept an image as their background, chosen
      // deliberately, so the design's image property stays free
      expect(getAddedElement().property).toBeUndefined();
    });

    it('leaves the element unbound when every compatible property is taken', () => {
      studio.initialize(
        { ...design_books, layouts: [emptyCardLayout] },
        designProperties,
      );
      studio.setActiveLayout(emptyCardLayout.id);

      // Image elements can only bind to the design's single image
      // property, which the first element claims
      studio.addDesignElementFromTemplate(
        ImageElementConfig.template,
        'root',
        0,
      );

      expect(getAddedElement().property).toBe('Cover');

      studio.addDesignElementFromTemplate(
        ImageElementConfig.template,
        'root',
        0,
      );

      expect(getAddedElement().property).toBeUndefined();
    });

    it('binds consecutive elements to different properties before a save runs', () => {
      studio.initialize(
        { ...design_books, layouts: [emptyCardLayout] },
        designProperties,
      );
      studio.setActiveLayout(emptyCardLayout.id);

      // Two text elements added back to back, with no save in
      // between. Resolving against the design's persisted tree would
      // miss the first binding and hand both the same property.
      studio.addDesignElementFromTemplate(
        TextElementConfig.template,
        'root',
        0,
      );

      const firstProperty = getAddedElement().property;

      studio.addDesignElementFromTemplate(
        TextElementConfig.template,
        'root',
        0,
      );

      const secondProperty = getAddedElement().property;

      expect(firstProperty).toBe('Title');
      expect(secondProperty).toBe('Subtitle');
    });

    it('leaves elements unbound when property binding is disabled', () => {
      studio.initializeLayoutEditor(layout_page_1, {
        onSave: () => {},
        mediaDirPath: MEDIA_DIR_PATH,
      });

      studio.addDesignElementFromTemplate(
        TextElementConfig.template,
        'root',
        0,
      );

      // Static elements carry their own content rather than a binding
      expect(getAddedElement()).toMatchObject({ static: true });
      expect(getAddedElement().property).toBeUndefined();
    });
  });

  describe('moveDesignElement', () => {
    // A card layout whose root holds a container nested two levels
    // deep, so a container can be dropped onto its own descendant
    const nestedLayout: Layout = {
      ...layout_card_1,
      tree: {
        ...layout_card_1.tree,
        children: [
          { ...element_container_1, children: [element_container_2] },
          element_text_2,
        ],
      },
    };

    beforeEach(() => {
      studio.initialize({ ...design_books, layouts: [nestedLayout] });
      studio.setActiveLayout(layout_card_1.id);
    });

    it('moves an element into a new parent', () => {
      studio.moveDesignElement(element_text_2.id, element_container_2.id, 0);

      expect(
        studio.getDesignElement<FlatParentDesignElement>(element_container_2.id)
          .children,
      ).toContain(element_text_2.id);
    });

    it('leaves a container dropped into its own subtree in place', () => {
      studio.moveDesignElement(
        element_container_1.id,
        element_container_2.id,
        0,
      );

      // The container still sits in the root, holding its subtree
      expect(
        studio.getDesignElement<FlatParentDesignElement>('root').children,
      ).toEqual([element_container_1.id, element_text_2.id]);
      expect(
        studio.getDesignElement<FlatParentDesignElement>(element_container_1.id)
          .children,
      ).toEqual([element_container_2.id]);
    });

    it('leaves a container dropped into itself in place', () => {
      studio.moveDesignElement(
        element_container_1.id,
        element_container_1.id,
        0,
      );

      expect(
        studio.getDesignElement<FlatParentDesignElement>('root').children,
      ).toEqual([element_container_1.id, element_text_2.id]);
    });
  });

  describe('getLiveLayout', () => {
    it('rebuilds the layout tree from unsaved element edits', () => {
      initializeWithActiveCardLayout();

      // Add an element, which lives in the store's flat element map
      // until a save persists it into the design's layout tree
      studio.addDesignElementFromTemplate(
        TextElementConfig.template,
        'root',
        0,
      );

      const addedElementId =
        studio.getDesignElement<FlatParentDesignElement>('root').children[0];

      // The design snapshot's tree does not yet hold the element
      const savedLayout = studio
        .getDesign()!
        .layouts.find((layout) => layout.id === layout_card_1.id)!;

      expect(
        savedLayout.tree.children.some(
          (child) => 'id' in child && child.id === addedElementId,
        ),
      ).toBe(false);

      // The live layout does
      const liveLayout = studio.getLiveLayout(layout_card_1.id)!;

      expect(
        liveLayout.tree.children.some(
          (child) => 'id' in child && child.id === addedElementId,
        ),
      ).toBe(true);
    });

    it('falls back to the active layout and returns null when unresolvable', () => {
      initializeWithActiveCardLayout();

      expect(studio.getLiveLayout()?.id).toBe(layout_card_1.id);
      expect(studio.getLiveLayout('layout_missing')).toBeNull();
    });
  });
});
