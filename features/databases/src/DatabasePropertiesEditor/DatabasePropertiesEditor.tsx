import { useCallback, useMemo } from 'react';
import { Databases } from '@minddrop/databases';
import { PropertySchema } from '@minddrop/properties';
import {
  SortableItemRenderProps,
  SortableList,
} from '@minddrop/ui-drag-and-drop';
import { DatabasePropertyEditor } from '../DatabasePropertyEditor';

/**
 * A property which has been added but not yet saved to the database.
 */
export type DraftProperty = PropertySchema & {
  id: number;
};

export interface DatabasePropertiesEditorProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The database ID.
   */
  databaseId: string;

  /**
   * Draft properties that have not yet been saved.
   */
  draftProperties: DraftProperty[];

  /**
   * Callback when a draft property is saved.
   */
  onSaveDraft: (id: number) => void;

  /**
   * Callback when a draft property creation is cancelled.
   */
  onCancelDraft: (id: number) => void;
}

/**
 * Renders the list of draft and persisted database property editors.
 */
export const DatabasePropertiesEditor: React.FC<
  DatabasePropertiesEditorProps
> = ({ databaseId, draftProperties, onSaveDraft, onCancelDraft }) => {
  const databaseConfig = Databases.use(databaseId);

  // Property names used as sortable item IDs
  const propertyIds = useMemo(
    () => databaseConfig?.properties.map((property) => property.name) ?? [],
    [databaseConfig?.properties],
  );

  // Build a lookup map for persisted properties by name
  const propertyMap = useMemo(() => {
    const map = new Map<string, PropertySchema>();

    if (databaseConfig) {
      for (const property of databaseConfig.properties) {
        map.set(property.name, property);
      }
    }

    return map;
  }, [databaseConfig]);

  // Handle sort by mapping the new order to storage order
  // and updating the database
  const handleSort = useCallback(
    (newOrder: string[]) => {
      if (!databaseConfig) {
        return;
      }

      const reorderedProperties = newOrder
        .map((name) => propertyMap.get(name))
        .filter((property): property is PropertySchema => !!property);

      Databases.update(databaseId, { properties: reorderedProperties });
    },
    [databaseId, databaseConfig, propertyMap],
  );

  // Render each sortable property item
  const renderItem = useCallback(
    (name: string, sortableProps: SortableItemRenderProps) => {
      const property = propertyMap.get(name);

      if (!property) {
        return null;
      }

      return (
        <div
          ref={sortableProps.ref}
          style={sortableProps.style}
          className={sortableProps.className}
        >
          <DatabasePropertyEditor
            databaseId={databaseId}
            property={property}
            dragHandleProps={sortableProps.handleProps}
          />
        </div>
      );
    },
    [databaseId, propertyMap],
  );

  if (!databaseConfig) {
    return null;
  }

  return (
    <div>
      {/* Persisted properties in natural order, sortable */}
      <SortableList
        items={propertyIds}
        direction="vertical"
        gap={1}
        onSort={handleSort}
        renderItem={renderItem}
        className="database-properties-editor-sortable"
      />
      {/* Draft properties appear at the bottom */}
      {draftProperties.map((property) => (
        <DatabasePropertyEditor
          isDraft
          key={property.name}
          databaseId={databaseId}
          property={property}
          onSaveDraft={() => onSaveDraft(property.id)}
          onCancelDraft={() => onCancelDraft(property.id)}
        />
      ))}
    </div>
  );
};
