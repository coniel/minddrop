import { afterEach, describe, expect, it } from 'vitest';
import {
  DesignFixtures,
  Designs,
  ElementTemplates,
  Layout,
} from '@minddrop/designs';
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
  addDeisgnElementFromTemplate,
  clearLayoutEditor,
  deleteHighlightedElement,
  getDesignElement,
  initializeLayoutEditor,
  saveDesign,
} from './DesignStudioStore';

const { layout_list_1, layout_page_1 } = DesignFixtures;

describe('DesignStudioStore', () => {
  afterEach(cleanup);

  it('initializes the store', () => {
    DesignStudioStore.getState().initialize(
      testDesign,
      testDatabase.properties,
    );

    // Sets initialized to true
    expect(DesignStudioStore.getState().initialized).toBe(true);
    // Sets the design
    expect(DesignStudioStore.getState().design).toEqual(testDesign);
    // Flattens each layout's tree into its own bucket
    expect(DesignStudioStore.getState().elementsByLayout).toEqual({
      [testLayout.id]: flatTree,
      [layout_list_1.id]: flattenTree(layout_list_1.tree),
      [layout_page_1.id]: flattenTree(layout_page_1.tree),
    });
    // No layout is active until one is selected
    expect(DesignStudioStore.getState().activeLayoutId).toBeNull();
    // Sets the properties
    expect(DesignStudioStore.getState().properties).toEqual(
      testDatabase.properties,
    );
  });

  it('activates a layout and selects its root element', () => {
    DesignStudioStore.getState().initialize(testDesign);

    DesignStudioStore.getState().setActiveLayout(testLayout.id);

    expect(DesignStudioStore.getState().activeLayoutId).toBe(testLayout.id);
    expect(DesignStudioStore.getState().selectedElementId).toBe('root');

    // Clearing the active layout clears the selection
    DesignStudioStore.getState().setActiveLayout(null);

    expect(DesignStudioStore.getState().activeLayoutId).toBeNull();
    expect(DesignStudioStore.getState().selectedElementId).toBeNull();
  });

  it('updates the elements by deeply merging the updates with the existing element', () => {
    DesignStudioStore.getState().initialize(
      testDesign,
      testDatabase.properties,
    );
    DesignStudioStore.getState().setActiveLayout(testLayout.id);

    // Update an element
    DesignStudioStore.getState().updateElement(element_text_1.id, {
      style: {
        'font-family': 'mono',
      },
    });

    expect(
      DesignStudioStore.getState().elementsByLayout[testLayout.id][
        element_text_1.id
      ],
    ).toEqual({
      ...flatTree[element_text_1.id],
      style: {
        ...element_text_1.style,
        'font-family': 'mono',
      },
    });

    // Update the element again
    DesignStudioStore.getState().updateElement(element_text_1.id, {
      style: {
        'font-weight': 900,
      },
    });

    expect(
      DesignStudioStore.getState().elementsByLayout[testLayout.id][
        element_text_1.id
      ],
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
    DesignStudioStore.getState().initialize(testDesign);
    DesignStudioStore.getState().setActiveLayout(testLayout.id);

    // The list layout contains an element with the same ID
    const listElementsBefore =
      DesignStudioStore.getState().elementsByLayout[layout_list_1.id];

    DesignStudioStore.getState().updateElement(element_text_1.id, {
      style: {
        'font-family': 'mono',
      },
    });

    // The list layout's bucket is untouched
    expect(
      DesignStudioStore.getState().elementsByLayout[layout_list_1.id],
    ).toEqual(listElementsBefore);
  });

  it('does not affect other layouts when adding an element to the active layout', () => {
    DesignStudioStore.getState().initialize(testDesign);
    DesignStudioStore.getState().setActiveLayout(testLayout.id);

    // Snapshot the list layout's bucket before the add
    const listElementsBefore =
      DesignStudioStore.getState().elementsByLayout[layout_list_1.id];

    // Add a new element to the active card layout's root
    const newElement = { ...element_0, id: 'added-element' };
    DesignStudioStore.getState().addElement(newElement, 'root', 0);

    // The new element lands in the card layout's bucket
    expect(
      DesignStudioStore.getState().elementsByLayout[testLayout.id][
        'added-element'
      ],
    ).toEqual(newElement);
    // The list layout's bucket is untouched
    expect(
      DesignStudioStore.getState().elementsByLayout[layout_list_1.id],
    ).toEqual(listElementsBefore);
  });

  it('saves the design by reconstructing every layout tree', async () => {
    // Persist the design fixtures and initialize the studio with
    // the test design (active layout is the card layout)
    setup();

    // Mutate an element in the active card layout
    DesignStudioStore.getState().updateElement(element_text_1.id, {
      style: {
        'font-family': 'mono',
      },
    });

    // Switch to the list layout and mutate an element there
    DesignStudioStore.getState().setActiveLayout(layout_list_1.id);
    DesignStudioStore.getState().updateElement(element_text_2.id, {
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

      initializeLayoutEditor(layout_page_1, { onSave: () => {} });

      const state = DesignStudioStore.getState();

      // The layout is flattened and active with its root selected
      expect(state.elementsByLayout[layout_page_1.id]).toEqual(
        flattenTree(layout_page_1.tree),
      );
      expect(state.activeLayoutId).toBe(layout_page_1.id);
      expect(state.selectedElementId).toBe('root');

      // Property binding defaults to disabled
      expect(state.propertyBindingEnabled).toBe(false);
    });

    it('persists edits through the save handler', async () => {
      setup({ initializeStore: false });

      // Capture the layout saved through the handler
      let savedLayout: Layout | undefined;

      initializeLayoutEditor(testLayout, {
        onSave: (layout) => {
          savedLayout = layout;
        },
      });

      // Mutate an element and save
      DesignStudioStore.getState().updateElement(element_text_1.id, {
        style: { 'font-family': 'mono' },
      });

      await saveDesign();

      // The handler received the reconstructed layout
      expect(flattenTree(savedLayout!.tree)[element_text_1.id]).toMatchObject({
        style: { 'font-family': 'mono' },
      });

      // The synthetic design was not persisted to the designs store
      const syntheticId = DesignStudioStore.getState().design!.id;

      expect(Designs.get(syntheticId, false)).toBeNull();
    });

    it('forces added content elements into static mode', () => {
      setup({ initializeStore: false });

      initializeLayoutEditor(layout_page_1, { onSave: () => {} });

      // Add a text and an icon element from their templates
      addDeisgnElementFromTemplate(ElementTemplates.text, 'root', 0);
      addDeisgnElementFromTemplate(ElementTemplates.icon, 'root', 1);

      // Resolve the added elements through the root's children
      const root = getDesignElement<FlatParentDesignElement>('root');
      const elements =
        DesignStudioStore.getState().elementsByLayout[layout_page_1.id];

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

      initializeLayoutEditor(layout_page_1, { onSave: () => {} });

      clearLayoutEditor();

      const state = DesignStudioStore.getState();

      // The session state is reset
      expect(state.initialized).toBe(false);
      expect(state.saveHandler).toBeNull();
      expect(state.propertyBindingEnabled).toBe(true);
    });
  });

  describe('deleteHighlightedElement', () => {
    it('deletes the highlighted element', () => {
      setup();

      // Highlight an element
      DesignStudioStore.getState().selectElement(element_text_1.id);

      deleteHighlightedElement();

      // The element is removed from the layout
      expect(
        DesignStudioStore.getState().elementsByLayout[testLayout.id][
          element_text_1.id
        ],
      ).toBeUndefined();
    });

    it('does not delete the layout root unless allowed', () => {
      setup();

      // Highlight the root element
      DesignStudioStore.getState().selectElement('root');

      deleteHighlightedElement();

      // The layout remains intact
      expect(
        DesignStudioStore.getState().elementsByLayout[testLayout.id],
      ).toBeDefined();
      expect(
        Designs.get(testDesign.id).layouts.some(
          (layout) => layout.id === testLayout.id,
        ),
      ).toBe(true);
    });
  });
});
