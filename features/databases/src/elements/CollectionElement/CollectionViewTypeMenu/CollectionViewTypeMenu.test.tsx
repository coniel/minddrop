import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewTypes } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { cleanup, setup } from '../../../test-utils';
import { CollectionElement } from '../CollectionElement.types';
import { CollectionViewTypeMenu } from './CollectionViewTypeMenu';

const { bodyDesignElement } = DesignElementFixtures;
const {
  contentViewType_gallery,
  contentViewType_board,
  contentViewType_databaseOnly,
} = ContentViewFixtures;

// The view type passed to the most recent change callback
let changedViewType: string | null;

/**
 * Renders the menu on a collection element with a recording change
 * callback and opens it. The menu opens on hover in use, but a click
 * on the trigger opens it synchronously.
 *
 * @param element - The collection element the menu sets the view type of.
 */
function renderMenu(element: Partial<CollectionElement> = {}) {
  changedViewType = null;

  render(
    <FloatingToolbar visible>
      <CollectionViewTypeMenu
        element={{ ...bodyDesignElement, ...element }}
        onChange={({ viewType }) => {
          changedViewType = viewType ?? null;
        }}
      />
    </FloatingToolbar>,
  );

  fireEvent.click(screen.getByLabelText('View type'));
}

describe('CollectionViewTypeMenu', () => {
  beforeEach(() => {
    setup();

    // Register view types supporting the collection data source, and
    // one supporting the database data source alone.
    ContentViewTypes.register(contentViewType_gallery);
    ContentViewTypes.register(contentViewType_board);
    ContentViewTypes.register(contentViewType_databaseOnly);
  });

  afterEach(cleanup);

  it('offers the view types supporting the collection data source', () => {
    renderMenu();

    expect(
      screen.getByLabelText(contentViewType_gallery.name),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(contentViewType_board.name),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(contentViewType_databaseOnly.name),
    ).toBeNull();
  });

  it('sets the chosen view type', () => {
    renderMenu();

    fireEvent.click(screen.getByLabelText(contentViewType_board.name));

    expect(changedViewType).toBe(contentViewType_board.type);
  });

  it('marks the gallery when the element has no view type', () => {
    renderMenu();

    expect(screen.getByLabelText(contentViewType_gallery.name)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marks the view type the element is set to', () => {
    renderMenu({ viewType: contentViewType_board.type });

    expect(screen.getByLabelText(contentViewType_board.name)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText(contentViewType_gallery.name)).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
