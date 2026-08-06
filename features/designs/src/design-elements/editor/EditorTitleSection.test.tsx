import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Design, DesignFixtures, Designs } from '@minddrop/designs';
import { render, screen, userEvent } from '@minddrop/test-utils';
import {
  getDesignElement,
  updateElementStyle,
  useDesignStudioStore,
} from '../../DesignStudioStore';
import { cleanup, setup, testDatabase } from '../../test-utils';
import { EditorTitleSection } from './EditorTitleSection';

const { design_books, layout_card_1, element_editor_1 } = DesignFixtures;

// A layout containing the editor element
const editorLayout = {
  ...layout_card_1,
  tree: { ...layout_card_1.tree, children: [element_editor_1] },
};

// A design with a title property and the editor layout
const editorDesign: Design = {
  ...design_books,
  id: 'design_editor-title-design',
  properties: [{ type: 'title', name: 'Name' }, ...design_books.properties],
  layouts: [editorLayout],
};

describe('<EditorTitleSection />', () => {
  beforeEach(() => {
    setup({ initializeStore: false });

    // Load the design into the designs store so studio element
    // updates can save it
    Designs.Store.load([editorDesign]);

    // Initialize the studio with the editor design and activate
    // the editor layout
    useDesignStudioStore
      .getState()
      .initialize(editorDesign, testDatabase.properties);
    useDesignStudioStore.getState().setActiveLayout(editorLayout.id);
  });

  afterEach(cleanup);

  it('binds the design title property when opened', async () => {
    render(<EditorTitleSection elementId={element_editor_1.id} />);

    // Open the collapsed section
    await userEvent.click(screen.getByText('designs.title.label'));

    // The design's title property should be bound
    expect(getDesignElement(element_editor_1.id)).toMatchObject({
      titleProperty: 'Name',
    });
  });

  it('edits the title typography styles', async () => {
    render(<EditorTitleSection elementId={element_editor_1.id} />);

    // Open the collapsed section
    await userEvent.click(screen.getByText('designs.title.label'));

    // Open the title font family select (the first combobox is
    // the title property select)
    await userEvent.click(screen.getAllByRole('combobox')[1]);

    await userEvent.click(
      screen.getByText('designs.typography.font-family.serif'),
    );

    // The title font family should be updated, leaving the
    // content font family untouched
    expect(getDesignElement(element_editor_1.id).style).toMatchObject({
      'title-font-family': 'serif',
      'font-family': 'inherit',
    });
  });

  it('unbinds the title and resets its styles on clear', async () => {
    render(<EditorTitleSection elementId={element_editor_1.id} />);

    // Open the collapsed section, binding the title property
    await userEvent.click(screen.getByText('designs.title.label'));

    // Customise a title style
    updateElementStyle(element_editor_1.id, 'title-font-size', 3);

    // Press the clear button
    await userEvent.click(
      screen.getByLabelText('designs.clear-custom-styling'),
    );

    // The title binding should be removed and the style reset
    expect(getDesignElement(element_editor_1.id)).not.toHaveProperty(
      'titleProperty',
    );
    expect(getDesignElement(element_editor_1.id).style).toMatchObject({
      'title-font-size': 1.625,
    });
  });
});
