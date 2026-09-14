import { CollectionsMenuItem } from '@minddrop/feature-collections';
import { DataViewsMenuItem } from '@minddrop/feature-data-views';
import { QueriesMenuItem } from '@minddrop/feature-queries';
import { SpacesMenuItem } from '@minddrop/feature-spaces';
import { TagsMenuItem } from '@minddrop/feature-tags';

/**
 * Renders the library group's contents: the items which open the
 * app's main views. They are navigation rather than entities, so
 * none of them can be dragged into another group.
 */
export const LibraryGroup: React.FC = () => (
  <>
    <SpacesMenuItem />
    <DataViewsMenuItem />
    <CollectionsMenuItem />
    <QueriesMenuItem />
    <TagsMenuItem />
  </>
);
