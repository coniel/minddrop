import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { ContentColor } from '@minddrop/ui-theme';
import { cleanup, setup } from '../test-utils';
import { DatabaseDesignPreviewToolbar } from './DatabaseDesignPreviewToolbar';

const {
  rootStorageDatabase,
  rootStorageEntry1,
  referenceEntry1,
  noPropertiesDatabase,
} = DatabaseFixtures;

// The values passed to the most recent change callbacks
let changedEntryId: string | null;
let changedColor: ContentColor | null | undefined;

interface RenderToolbarOptions {
  /**
   * The picked colour.
   */
  color?: ContentColor | null;

  /**
   * The previewed entry's own colour.
   */
  entryColor?: ContentColor | null;
}

/**
 * Renders the toolbar on the root storage database with
 * recording change callbacks.
 *
 * @param options - The toolbar's colour state.
 */
function renderToolbar(options: RenderToolbarOptions = {}) {
  changedEntryId = null;
  changedColor = undefined;

  render(
    <DatabaseDesignPreviewToolbar
      databaseId={rootStorageDatabase.id}
      entryId={rootStorageEntry1.id}
      color={options.color}
      entryColor={options.entryColor}
      onEntryChange={(entryId) => {
        changedEntryId = entryId;
      }}
      onColorChange={(color) => {
        changedColor = color;
      }}
    />,
  );
}

/**
 * Opens the entry menu.
 */
async function openEntryMenu() {
  await userEvent.click(screen.getByText(rootStorageEntry1.title));
}

/**
 * Opens the colour menu.
 */
async function openColorMenu() {
  await userEvent.click(screen.getByLabelText('Entry colour'));
}

describe('<DatabaseDesignPreviewToolbar />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('labels the entry trigger with the previewed entry', () => {
    renderToolbar();

    expect(screen.getByText(rootStorageEntry1.title)).toBeInTheDocument();
  });

  it("lists the database's entries", async () => {
    renderToolbar();
    await openEntryMenu();

    expect(
      screen.getAllByRole('menuitem').map((item) => item.textContent),
    ).toContain(referenceEntry1.title);
  });

  it('reports the picked entry', async () => {
    renderToolbar();
    await openEntryMenu();

    await userEvent.click(screen.getByText(referenceEntry1.title));

    expect(changedEntryId).toBe(referenceEntry1.id);
  });

  it('reports the picked colour', async () => {
    renderToolbar();
    await openColorMenu();

    await userEvent.click(screen.getByText('Red'));

    expect(changedColor).toBe('red');
  });

  it("clears the colour through the option following the entry's", async () => {
    renderToolbar({ color: 'red', entryColor: 'blue' });
    await openColorMenu();

    await userEvent.click(screen.getByText('Match entry'));

    expect(changedColor).toBeNull();
  });

  it('shows the picked colour on the trigger', () => {
    renderToolbar({ color: 'red', entryColor: 'blue' });

    expect(resolveTriggerSwatchColor()).toBe('var(--red-900)');
  });

  it("falls back to the entry's colour on the trigger", () => {
    renderToolbar({ entryColor: 'blue' });

    expect(resolveTriggerSwatchColor()).toBe('var(--blue-900)');
  });

  it('keeps the colour picker alone for a database without entries', () => {
    render(
      <DatabaseDesignPreviewToolbar
        databaseId={noPropertiesDatabase.id}
        onEntryChange={() => {}}
        onColorChange={() => {}}
      />,
    );

    expect(screen.getByLabelText('Entry colour')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});

/**
 * Resolves the colour the trigger's swatch is filled in. jsdom
 * keeps the custom property in the style attribute but cannot
 * resolve it, so the swatch is read from there.
 *
 * @returns The swatch's fill.
 */
function resolveTriggerSwatchColor(): string | undefined {
  const swatch = screen
    .getByLabelText('Entry colour')
    .querySelector('.content-color-swatch');

  return swatch instanceof HTMLElement ? swatch.style.background : undefined;
}
