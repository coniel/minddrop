import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries, DatabaseFixtures } from '@minddrop/databases';
import { DesignFixtures } from '@minddrop/designs';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseEntryRenderer } from './DatabaseEntryRenderer';

const { objectEntry1, defaultCardLayout } = DatabaseFixtures;
const { layout_list_1 } = DesignFixtures;

describe('<DatabaseEntryRenderer />', () => {
  beforeEach(() => {
    setup();

    // Load the entry into the store so the renderer can resolve it
    DatabaseEntries.Store.load([objectEntry1]);
  });

  afterEach(() => {
    cleanup();
    DatabaseEntries.Store.clear();
  });

  it('renders an entry using the default layout', () => {
    render(
      <DatabaseEntryRenderer entryId={objectEntry1.id} layoutContext="card" />,
    );

    // Layout fixture renders its ID as content
    screen.getByText(defaultCardLayout.id);
  });

  it('renders an entry using the specified layout', () => {
    render(
      <DatabaseEntryRenderer
        entryId={objectEntry1.id}
        layoutContext="list"
        layoutId={layout_list_1.id}
      />,
    );

    // Layout fixture renders its ID as content
    screen.getByText(layout_list_1.id);
  });

  it('returns null if the entry does not exist', () => {
    const { container } = render(
      <DatabaseEntryRenderer
        entryId="non-existent-entry"
        layoutContext="card"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
