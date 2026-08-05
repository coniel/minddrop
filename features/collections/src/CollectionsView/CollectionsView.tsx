import { Collections } from '@minddrop/collections';
import { PanelView } from '@minddrop/ui-components';
import { MenuGroup, MenuItem, ScrollArea } from '@minddrop/ui-primitives';
import './CollectionsView.css';

/**
 * Renders a panel view listing all persisted collections.
 */
export const CollectionsView: React.FC = () => {
  const collections = Collections.useAll();

  // List only persisted collections, excluding virtual ones
  const persistedCollections = collections.filter(
    (collection) => !collection.virtual,
  );

  return (
    <PanelView
      className="collections-view"
      icon="library"
      title="collections.labels.collections"
    >
      {/* The list of collections */}
      <ScrollArea className="collections-view-content">
        <MenuGroup>
          {persistedCollections.map((collection) => (
            <MenuItem muted icon="library" key={collection.id}>
              {collection.name}
            </MenuItem>
          ))}
        </MenuGroup>
      </ScrollArea>
    </PanelView>
  );
};
