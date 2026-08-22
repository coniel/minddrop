import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Layout } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { i18n } from '@minddrop/i18n';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { cleanup, setup } from '../test-utils';
import { LayoutNameField } from './LayoutNameField';

const { design_books, layout_card_1 } = DesignFixtures;

describe('<LayoutNameField />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('names the layout, blanking type names behind the placeholder', () => {
    const studio = createDesignStudioStore();

    // A layout still carrying its type name as its name
    const unnamedLayout = {
      ...layout_card_1,
      name: i18n.t('designs.layouts.card.name'),
    };

    studio.initialize({ ...design_books, layouts: [unnamedLayout] });

    renderField(studio, unnamedLayout);

    const field = screen.getByRole('textbox') as HTMLInputElement;

    // The type name reads as unnamed, leaving the field empty
    expect(field.value).toBe('');
    expect(field.placeholder).toBe(i18n.t('designs.layouts.card.name'));
  });

  it('renames the layout on blur', async () => {
    const studio = createDesignStudioStore();

    studio.initialize(design_books);

    renderField(studio, layout_card_1);

    const field = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(field, { target: { value: 'Compact card' } });
    fireEvent.blur(field);

    await waitFor(() =>
      expect(
        studio
          .getDesign()
          ?.layouts.find((layout) => layout.id === layout_card_1.id)?.name,
      ).toBe('Compact card'),
    );
  });
});

/**
 * Renders the name field within the studio provider.
 */
function renderField(studio: DesignStudioStore, layout: Layout) {
  return render(
    <DesignStudioProvider store={studio}>
      <LayoutNameField layout={layout} />
    </DesignStudioProvider>,
  );
}
