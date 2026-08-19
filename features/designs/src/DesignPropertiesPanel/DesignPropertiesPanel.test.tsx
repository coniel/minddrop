import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures, Designs } from '@minddrop/designs';
import {
  cleanup as cleanupRender,
  render,
  screen,
  userEvent,
} from '@minddrop/test-utils';
import {
  DesignStudioProvider,
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { cleanup, setup } from '../test-utils';
import {
  DesignPropertiesPanel,
  DraftDesignProperty,
} from './DesignPropertiesPanel';

const { design_books, design_empty } = DesignFixtures;

// A property being drafted, as staged by the left panel's add menu
const draftProperty: DraftDesignProperty = {
  id: 1,
  type: 'text',
  name: 'Publisher',
};

describe('<DesignPropertiesPanel />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it("renders the design's properties", () => {
    renderPanel(openDesign(design_books));

    design_books.properties.forEach((property) => {
      screen.getByText(property.name);
    });
  });

  it('renders an empty state when there is nothing to edit', () => {
    renderPanel(openDesign(design_empty));

    screen.getByText('designs.properties.empty');
  });

  it('renders draft properties alongside the persisted ones', () => {
    renderPanel(openDesign(design_books), [draftProperty]);

    screen.getByText('Publisher');
  });

  it('adds a saved draft to the design', async () => {
    const studio = openDesign(design_empty);

    renderPanel(studio, [draftProperty]);

    // The draft's editor opens by default, so its save action is
    // available straight away
    await userEvent.click(screen.getByText('actions.save'));

    // The property reaches both the studio's design and the store
    expect(studio.getDesignProperty('Publisher')).not.toBeNull();

    const design = Designs.get(design_empty.id);

    expect(
      design.type === 'database' &&
        design.properties.some((property) => property.name === 'Publisher'),
    ).toBe(true);
  });

  it('drops a removed property from the design and the list', async () => {
    const studio = openDesign(design_books);

    await studio.removeDesignProperty('Summary');

    renderPanel(studio);

    // The removed property is gone from the list, the rest remain
    expect(screen.queryByText('Summary')).toBeNull();
    screen.getByText('Subtitle');

    // It is gone from the studio and the persisted design too
    expect(studio.getDesignProperty('Summary')).toBeNull();

    const design = Designs.get(design_books.id);

    expect(
      design.type === 'database' &&
        design.properties.some((property) => property.name === 'Summary'),
    ).toBe(false);
  });
});

/**
 * Opens a design in a fresh studio instance.
 */
function openDesign(
  design: typeof design_books | typeof design_empty,
): DesignStudioStore {
  const studio = createDesignStudioStore();

  studio.initialize(design, design.properties);

  return studio;
}

/**
 * Renders the properties panel within the given studio.
 */
function renderPanel(
  studio: DesignStudioStore,
  draftProperties: DraftDesignProperty[] = [],
) {
  return render(
    <DesignStudioProvider store={studio}>
      <DesignPropertiesPanel
        draftProperties={draftProperties}
        onSaveDraft={() => undefined}
        onCancelDraft={() => undefined}
      />
    </DesignStudioProvider>,
  );
}
