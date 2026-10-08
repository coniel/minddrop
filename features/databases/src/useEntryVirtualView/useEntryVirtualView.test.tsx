import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewTypes, ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseEntries } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { useEntryVirtualView } from './useEntryVirtualView';

const { collectionDatabase, collectionEntry1, relatedPropertyName } =
  DatabaseFixtures;
const { contentViewType_gallery } = ContentViewFixtures;

// The virtual collection of the entry's Related property, as the
// property's value reaches elements.
const collectionId = String(
  DatabaseEntries.resolvePropertyValues(
    collectionEntry1,
    collectionDatabase.properties,
  )[relatedPropertyName],
);

// The ID of the design element embedding the view
const elementId = 'element_related';

interface ProbeProps {
  /**
   * The virtual collection the view is embedded over, null for none.
   */
  collectionId: string | null;
}

/**
 * Renders the ID of the view the hook resolves, 'none' when it
 * resolves none.
 */
const ViewProbe: React.FC<ProbeProps> = ({ collectionId }) => {
  const view = useEntryVirtualView(
    collectionId,
    elementId,
    contentViewType_gallery.type,
  );

  return <div data-testid="view">{view?.id ?? 'none'}</div>;
};

describe('useEntryVirtualView', () => {
  beforeEach(() => {
    setup();

    // Register the view type the view renders as
    ContentViewTypes.register(contentViewType_gallery);
  });

  afterEach(cleanup);

  it('creates and returns the view for the collection', () => {
    render(<ViewProbe collectionId={collectionId} />);

    const viewId = DatabaseEntries.virtualViewId(
      collectionId,
      elementId,
      contentViewType_gallery.type,
    );

    expect(ContentViews.Store).toHaveItem(viewId);
    expect(screen.getByTestId('view').textContent).toBe(viewId);
  });

  it('returns null without a collection', () => {
    render(<ViewProbe collectionId={null} />);

    expect(screen.getByTestId('view').textContent).toBe('none');
  });
});
