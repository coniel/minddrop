import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import {
  DesignElementConfigs,
  Designs as DesignsNext,
} from '@minddrop/designs-next';
import {
  DesignElementConfigsRegistry,
  DesignElementFixtures,
  DesignFixtures,
} from '@minddrop/designs-next/test-utils';
import {
  LayoutRegionSizesStore,
  layoutRegionSizeKey,
} from '@minddrop/feature-designs';
import { render, screen } from '@minddrop/test-utils';
import { StandInElementFixtures } from '@minddrop/ui-designs-next/test-utils';
import { getWindowSizeSlot } from '@minddrop/utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseEntryDialog } from './DatabaseEntryDialog';
import { DIALOG_CONTEXT, DIALOG_FRAME_REGION } from './useDialogSize';

const { objectEntry1, objectDatabase } = DatabaseFixtures;
const { pageDesign_1 } = DesignFixtures;
const { titleDesignElement } = DesignElementFixtures;
const { elementConfig_value } = StandInElementFixtures;

// A database with a text property. Only a design renders the
// property's value. The title-only fallback does not show it.
const database = {
  ...objectDatabase,
  properties: [{ type: 'text' as const, name: 'Body' }],
};

const entry = {
  ...objectEntry1,
  properties: { Body: 'Design value' },
};

// The database's page design, mapping its only element to the Body
// property.
const pageDesign = {
  ...pageDesign_1,
  owner: database.id,
  elements: [
    { ...titleDesignElement, type: elementConfig_value.type, property: 'Body' },
  ],
};

// A size remembered for the page design in the dialog
const rememberedSize = { width: 640, height: 480 };

describe('<DatabaseEntryDialog />', () => {
  beforeEach(() => {
    setup();

    Databases.Store.load([database]);
    DatabaseEntries.Store.load([entry]);
    DesignsNext.Store.load([pageDesign]);

    // Register the element type the design renders
    DesignElementConfigs.register(elementConfig_value);
  });

  afterEach(async () => {
    await cleanup();
    DatabaseEntries.Store.clear();
    DesignElementConfigsRegistry.clear();
    LayoutRegionSizesStore.reset();
  });

  /**
   * Renders the dialog open on the entry.
   *
   * @returns The dialog canvas element.
   */
  function renderDialog(): HTMLElement {
    const { container } = render(
      <DatabaseEntryDialog open entryId={entry.id} onOpenChange={() => {}} />,
    );

    return container.querySelector('.database-entry-dialog-canvas')!;
  }

  it("renders the entry with the database's dialog design", () => {
    renderDialog();

    screen.getByText(entry.properties.Body);
  });

  it('renders the entry title alone when the database owns no dialog design', () => {
    DesignsNext.Store.clear();

    renderDialog();

    screen.getByText(entry.title);
    expect(screen.queryByText(entry.properties.Body)).toBeNull();
  });

  it("restores the size remembered for the database's dialog design", () => {
    LayoutRegionSizesStore.set(
      layoutRegionSizeKey(
        pageDesign.id,
        DIALOG_CONTEXT,
        DIALOG_FRAME_REGION,
        getWindowSizeSlot(),
      ),
      rememberedSize,
    );

    const canvas = renderDialog();

    expect(canvas.style.width).toBe(`${rememberedSize.width}px`);
    expect(canvas.style.height).toBe(`${rememberedSize.height}px`);
  });

  it('ignores a size remembered for another design', () => {
    LayoutRegionSizesStore.set(
      layoutRegionSizeKey(
        'design_other',
        DIALOG_CONTEXT,
        DIALOG_FRAME_REGION,
        getWindowSizeSlot(),
      ),
      rememberedSize,
    );

    const canvas = renderDialog();

    expect(canvas.style.width).not.toBe(`${rememberedSize.width}px`);
  });
});
