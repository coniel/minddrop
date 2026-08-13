import { afterEach, describe, expect, it } from 'vitest';
import {
  DesignFixtures,
  Designs,
  ElementTemplates,
  Layout,
  resolveDesignMediaDirPath,
} from '@minddrop/designs-legacy';
import { DEFAULT_STATIC_ICON } from '../constants';
import {
  cleanup,
  element_0,
  element_text_1,
  element_text_2,
  flatTree,
  setup,
  testDatabase,
  testDesign,
  testLayout,
} from '../test-utils';
import { FlatParentDesignElement } from '../types';
import { flattenTree } from '../utils';
import {
  DesignStudioStore,
  addDesignElementFromTemplate,
  clearLayoutEditor,
  deleteHighlightedElement,
  getDesignElement,
  initializeLayoutEditor,
  saveDesign,
} from './DesignStudioStore';

const { layout_list_1, layout_page_1 } = DesignFixtures;

const MEDIA_DIR_PATH = 'workspace/.minddrop/spaces/space_1/media';

describe('DesignStudioStore', () => {
  afterEach(cleanup);

  it('initializes the store', () => {
    DesignStudioStore.initialize(testDesign, testDatabase.properties);

    // Sets initialized to true
    expect(DesignStudioStore.isInitialized()).toBe(true);
    // Sets the design
    expect(DesignStudioStore.getDesign()).toEqual(testDesign);
    // Flattens each layout's tree into its own bucket
    expect(DesignStudioStore.getElementsByLayout()).toEqual({
      [testLayout.id]: flatTree,
      [layout_list_1.id]: flattenTree(layout_list_1.tree),
      [layout_page_1.id]: flattenTree(layout_page_1.tree),
    });
    // No layout is active until one is selected
    expect(DesignStudioStore.getActiveLayoutId()).toBeNull();
    // Sets the properties
    expect(DesignStudioStore.getProperties()).toEqual(testDatabase.properties);
    // Media resolves against the design's media directory
    expect(DesignStudioStore.getMediaDirPath()).toBe(
      resolveDesignMediaDirPath(testDesign.id),
    );
  });

  it('activates a layout and selects its root element', () => {
    DesignStudioStore.initialize(testDesign);

    DesignStudioStore.setActiveLayout(testLayout.id);

    expect(DesignStudioStore.getActiveLayoutId()).toBe(testLayout.id);
    expect(DesignStudioStore.getSelectedElementId()).toBe('root');

    // Clearing the active layout clears the selection
    DesignStudioStore.setActiveLayout(null);

    expect(DesignStudioStore.getActiveLayoutId()).toBeNull();
    expect(DesignStudioStore.getSelectedElementId()).toBeNull();
  });

  it('updates the elements by deeply merging the updates with the existing element', () => {
    DesignStudioStore.initialize(testDesign, testDatabase.properties);
    DesignStudioStore.setActiveLayout(testLayout.id);

    // Update an element
    DesignStudioStore.updateElement(element_text_1.id, {
      style: {
        'font-family': 'mono',
      },
    });

    expect(
      DesignStudioStore.getElements(testLayout.id)[element_text_1.id],
    ).toEqual({
      ...flatTree[element_text_1.id],
      style: {
        ...element_text_1.style,
        'font-family': 'mono',
      },
    });

    // Update the element again
    DesignStudioStore.updateElement(element_text_1.id, {
      style: {
        'font-weight': 900,
      },
    });

    expect(
      DesignStudioStore.getElements(testLayout.id)[element_text_1.id],
    ).toEqual({
      ...flatTree[element_text_1.id],
      style: {
        ...element_text_1.style,
        'font-family': 'mono',
        'font-weight': 900,
      },
    });
  });

  it('does not affect other layouts when mutating elements in the active layout', () => {
    DesignStudioStore.initialize(testDesign);
    DesignStudioStore.setActiveLayout(testLayout.id);

    // The list layout contains an element with the same ID
    const listElementsBefore = DesignStudioStore.getElements(layout_list_1.id);

    DesignStudioStore.updateElement(element_text_1.id, {
      style: {
        'font-family': 'mono',
      },
    });

    // The list layout's bucket is untouched
    expect(DesignStudioStore.getElements(layout_list_1.id)).toEqual(
      listElementsBefore,
    );
  });

  it('does not affect other layouts when adding an element to the active layout', () => {
    DesignStudioStore.initialize(testDesign);
    DesignStudioStore.setActiveLayout(testLayout.id);

    // Snapshot the list layout's bucket before the add
    const listElementsBefore = DesignStudioStore.getElements(layout_list_1.id);

    // Add a new element to the active card layout's root
    const newElement = { ...element_0, id: 'added-element' };
    DesignStudioStore.addElement(newElement, 'root', 0);

    // The new element lands in the card layout's bucket
    expect(
      DesignStudioStore.getElements(testLayout.id)['added-element'],
    ).toEqual(newElement);
    // The list layout's bucket is untouched
    expect(DesignStudioStore.getElements(layout_list_1.id)).toEqual(
      listElementsBefore,
    );
  });

  it('saves the design by reconstructing every layout tree', async () => {
    // Persist the design fixtures and initialize the studio with
    // the test design (active layout is the card layout)
    setup();

    // Mutate an element in the active card layout
    DesignStudioStore.updateElement(element_text_1.id, {
      style: {
        'font-family': 'mono',
      },
    });

    // Switch to the list layout and mutate an element there
    DesignStudioStore.setActiveLayout(layout_list_1.id);
    DesignStudioStore.updateElement(element_text_2.id, {
      style: {
        'font-weight': 900,
      },
    });

    await saveDesign();

    // Read the persisted design back and flatten both mutated layouts
    const saved = Designs.get(testDesign.id);
    const cardElements = flattenTree(
      saved.layouts.find((layout) => layout.id === testLayout.id)!.tree,
    );
    const listElements = flattenTree(
      saved.layouts.find((layout) => layout.id === layout_list_1.id)!.tree,
    );

    // The card layout's tree reflects the font-family change
    expect(cardElements[element_text_1.id]).toMatchObject({
      style: { 'font-family': 'mono' },
    });
    // The list layout's tree reflects the font-weight change
    expect(listElements[element_text_2.id]).toMatchObject({
      style: { 'font-weight': 900 },
    });
    // The list layout mutation did not leak into the card layout
    expect(cardElements[element_text_2.id]).not.toMatchObject({
      style: { 'font-weight': 900 },
    });
  });

  describe('layout editor session', () => {
    it('initializes the editor with a single active layout', () => {
      setup({ initializeStore: false });

      initializeLayoutEditor(layout_page_1, {
        onSave: () => {},
        mediaDirPath: MEDIA_DIR_PATH,
      });

      // The layout is flattened and active with its root selected
      expect(DesignStudioStore.getElements(layout_page_1.id)).toEqual(
        flattenTree(layout_page_1.tree),
      );
      expect(DesignStudioStore.getActiveLayoutId()).toBe(layout_page_1.id);
      expect(DesignStudioStore.getSelectedElementId()).toBe('root');

      // Property binding defaults to disabled
      expect(DesignStudioStore.isPropertyBindingEnabled()).toBe(false);

      // Media resolves against the owner's media directory
      expect(DesignStudioStore.getMediaDirPath()).toBe(MEDIA_DIR_PATH);
    });

    it('persists edits through the save handler', async () => {
      setup({ initializeStore: false });

      // Capture the layout saved through the handler
      let savedLayout: Layout | undefined;

      initializeLayoutEditor(testLayout, {
        onSave: (layout) => {
          savedLayout = layout;
        },
        mediaDirPath: MEDIA_DIR_PATH,
      });

      // Mutate an element and save
      DesignStudioStore.updateElement(element_text_1.id, {
        style: { 'font-family': 'mono' },
      });

      await saveDesign();

      // The handler received the reconstructed layout
      expect(flattenTree(savedLayout!.tree)[element_text_1.id]).toMatchObject({
        style: { 'font-family': 'mono' },
      });

      // The synthetic design was not persisted to the designs store
      const syntheticId = DesignStudioStore.getDesign()!.id;

      expect(Designs.get(syntheticId, false)).toBeNull();
    });

    it('forces added content elements into static mode', () => {
      setup({ initializeStore: false });

      initializeLayoutEditor(layout_page_1, {
        onSave: () => {},
        mediaDirPath: MEDIA_DIR_PATH,
      });

      // Add a text and an icon element from their templates
      addDesignElementFromTemplate(ElementTemplates.text, 'root', 0);
      addDesignElementFromTemplate(ElementTemplates.icon, 'root', 1);

      // Resolve the added elements through the root's children
      const root = getDesignElement<FlatParentDesignElement>('root');
      const elements = DesignStudioStore.getElements(layout_page_1.id);

      // Content elements start in static mode
      expect(elements[root.children[0]]).toMatchObject({
        type: 'text',
        static: true,
      });

      // Icon elements receive the default static icon
      expect(elements[root.children[1]]).toMatchObject({
        type: 'icon',
        static: true,
        icon: DEFAULT_STATIC_ICON,
      });
    });

    it('clears the editor session', () => {
      setup({ initializeStore: false });

      initializeLayoutEditor(layout_page_1, {
        onSave: () => {},
        mediaDirPath: MEDIA_DIR_PATH,
      });

      clearLayoutEditor();

      // The session state is reset
      expect(DesignStudioStore.isInitialized()).toBe(false);
      expect(DesignStudioStore.getSaveHandler()).toBeNull();
      expect(DesignStudioStore.isPropertyBindingEnabled()).toBe(true);
      expect(DesignStudioStore.getMediaDirPath()).toBeNull();
    });
  });

  describe('deleteHighlightedElement', () => {
    it('deletes the highlighted element', () => {
      setup();

      // Highlight an element
      DesignStudioStore.selectElement(element_text_1.id);

      deleteHighlightedElement();

      // The element is removed from the layout
      expect(
        DesignStudioStore.getElements(testLayout.id)[element_text_1.id],
      ).toBeUndefined();
    });

    it('does not delete the layout root unless allowed', () => {
      setup();

      // Highlight the root element
      DesignStudioStore.selectElement('root');

      deleteHighlightedElement();

      // The layout remains intact
      expect(DesignStudioStore.getElementsByLayout()).toHaveProperty(
        testLayout.id,
      );
      expect(
        Designs.get(testDesign.id).layouts.some(
          (layout) => layout.id === testLayout.id,
        ),
      ).toBe(true);
    });
  });
});
