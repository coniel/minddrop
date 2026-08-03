import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Design, DesignFixtures, Designs } from '@minddrop/designs';
import { render, screen, userEvent } from '@minddrop/test-utils';
import {
  getDesignElement,
  updateDesignElement,
  useDesignStudioStore,
} from '../../DesignStudioStore';
import { cleanup, setup, testDatabase } from '../../test-utils';
import { ElementTitlePropertyField } from './ElementTitlePropertyField';

const { design_books, layout_card_1, element_editor_1 } = DesignFixtures;

// A layout containing the editor element
const editorLayout = {
  ...layout_card_1,
  tree: { ...layout_card_1.tree, children: [element_editor_1] },
};

// A design with a title property and the editor layout
const editorDesign: Design = {
  ...design_books,
  id: 'editor-title-design',
  properties: [{ type: 'title', name: 'Name' }, ...design_books.properties],
  layouts: [editorLayout],
};

describe('<ElementTitlePropertyField />', () => {
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

  it('binds the selected property as the element title', async () => {
    // Start from a bound state: the unbound-to-bound transition
    // misfires a stale change event in jsdom (covered through the
    // EditorTitleSection open behaviour instead)
    updateDesignElement(element_editor_1.id, { titleProperty: 'Subtitle' });

    render(<ElementTitlePropertyField elementId={element_editor_1.id} />);

    await userEvent.click(screen.getByRole('combobox'));

    await userEvent.click(screen.getByText('Name'));

    expect(getDesignElement(element_editor_1.id)).toMatchObject({
      titleProperty: 'Name',
    });
  });

  it('unbinds the title when the none option is selected', async () => {
    // Bind a title property to the element
    updateDesignElement(element_editor_1.id, { titleProperty: 'Name' });

    render(<ElementTitlePropertyField elementId={element_editor_1.id} />);

    await userEvent.click(screen.getByRole('combobox'));

    await userEvent.click(screen.getByText('designs.property.none'));

    expect(getDesignElement(element_editor_1.id)).not.toHaveProperty(
      'titleProperty',
    );
  });
});
