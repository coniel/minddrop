import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  ContentViewType,
  ContentViewTypeComponentProps,
  ContentViewTypes,
} from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseEntries } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { DesignPropertiesProvider } from '@minddrop/ui-designs-next';
import { cleanup, setup } from '../../../test-utils';
import { CollectionElement } from '../CollectionElement.types';
import { CollectionElementConfig } from '../CollectionElementConfig';
import { CollectionElementRenderer } from './CollectionElementRenderer';

const {
  collectionDatabase,
  collectionEntry1,
  relatedEntry1,
  relatedEntry2,
  relatedPropertyName,
} = DatabaseFixtures;
const { bodyDesignElement } = DesignElementFixtures;
const { contentViewType_gallery, contentViewType_table } = ContentViewFixtures;

// The entry's property values as they reach elements
const values = DatabaseEntries.resolvePropertyValues(
  collectionEntry1,
  collectionDatabase.properties,
);

// The virtual collection of the entry's Related property
const collectionId = String(values[relatedPropertyName]);

/**
 * Renders the IDs of the entries a view is given.
 */
const EntriesProbe: React.FC<ContentViewTypeComponentProps> = ({ entries }) => (
  <div>{entries.join(',')}</div>
);

// A gallery rendering its entries' IDs, with a skeleton rendering the
// text "skeleton".
const galleryViewType: ContentViewType = {
  ...contentViewType_gallery,
  component: EntriesProbe,
  skeletonComponent: () => <div>skeleton</div>,
};

// A table rendering the text "table"
const tableViewType: ContentViewType = {
  ...contentViewType_table,
  component: () => <div>table</div>,
};

// A collection element mapped to the Related property
const collectionElement: CollectionElement = {
  ...bodyDesignElement,
  type: CollectionElementConfig.type,
  property: relatedPropertyName,
};

/**
 * Renders the element with the entry's property values.
 *
 * @param element - The element to render.
 */
function renderCollection(element: CollectionElement) {
  render(
    <DesignPropertiesProvider
      properties={collectionDatabase.properties}
      values={values}
    >
      <CollectionElementRenderer element={element} />
    </DesignPropertiesProvider>,
  );
}

describe('CollectionElementRenderer', () => {
  beforeEach(() => {
    setup();

    // Register the gallery the element embeds by default, and the
    // table it can be set to.
    ContentViewTypes.register(galleryViewType);
    ContentViewTypes.register(tableViewType);

    // Create the virtual collection the property's value names
    Collections.createVirtual(collectionId, relatedPropertyName, [
      relatedEntry1.id,
      relatedEntry2.id,
    ]);
  });

  afterEach(cleanup);

  it("embeds the collection's entries through the element's view type", () => {
    renderCollection(collectionElement);

    expect(
      screen.getByText([relatedEntry1.id, relatedEntry2.id].join(',')),
    ).toBeInTheDocument();
  });

  it('embeds a view of the view type the element is set to', () => {
    renderCollection({ ...collectionElement, viewType: tableViewType.type });

    expect(screen.getByText('table')).toBeInTheDocument();
  });

  it("renders the view type's skeleton while the element is unmapped", () => {
    renderCollection({ ...collectionElement, property: undefined });

    expect(screen.getByText('skeleton')).toBeInTheDocument();
  });
});
