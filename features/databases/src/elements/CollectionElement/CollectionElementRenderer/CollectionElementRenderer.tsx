import { Collections } from '@minddrop/collections';
import { ContentViewTypes } from '@minddrop/content-views';
import { DesignElementProps } from '@minddrop/designs-next';
import { ContentViewRenderer } from '@minddrop/feature-content-views';
import {
  resolveElementStyle,
  useElementProperty,
} from '@minddrop/ui-designs-next';
import { Stack } from '@minddrop/ui-primitives';
import { useEntryVirtualView } from '../../../useEntryVirtualView';
import { CollectionElement } from '../CollectionElement.types';
import { DefaultCollectionViewType } from '../constants';
import './CollectionElementRenderer.css';

/**
 * Renders a collection element as a content view containing the
 * entries of the collection property it maps to.
 */
export const CollectionElementRenderer: React.FC<
  DesignElementProps<CollectionElement>
> = ({ element }) => {
  // Read the property the element maps to
  const property = useElementProperty(element);
  // Resolve the view type the element embeds, gallery by default
  const viewType = element.viewType ?? DefaultCollectionViewType;
  // Read the virtual collection ID from the property's value, null
  // while unmapped.
  const collectionId =
    typeof property?.value === 'string' ? property.value : null;
  // Subscribe to the view the element embeds for the collection
  const view = useEntryVirtualView(collectionId, element.id, viewType);
  // Subscribe to the collection
  const collection = Collections.use(collectionId ?? '');
  // Subscribe to the view type
  const viewTypeConfig = ContentViewTypes.use(viewType);
  // Resolve the element's settings into the styles they render as
  const style = resolveElementStyle(element);

  // Render the view type's skeleton while the element is unmapped
  if (!collectionId) {
    // Read the view type's skeleton component
    const Skeleton = viewTypeConfig?.skeletonComponent;

    return (
      <Stack gap={0} className="database-collection-element" style={style}>
        {Skeleton && <Skeleton />}
      </Stack>
    );
  }

  return (
    <Stack gap={0} className="database-collection-element" style={style}>
      {view && (
        <ContentViewRenderer view={view} entries={collection?.items ?? []} />
      )}
    </Stack>
  );
};
