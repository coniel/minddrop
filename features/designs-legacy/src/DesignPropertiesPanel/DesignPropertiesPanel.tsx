import { useCallback, useMemo } from 'react';
import { PropertySchema } from '@minddrop/properties';
import {
  SortableItemRenderProps,
  SortableList,
} from '@minddrop/ui-drag-and-drop';
import { ScrollArea, Text } from '@minddrop/ui-primitives';
import { DesignPropertyEditor } from '../DesignPropertyEditor';
import {
  updateDesignProperties,
  useDesignStudioStore,
} from '../DesignStudioStore';
import './DesignPropertiesPanel.css';

export type DraftDesignProperty = PropertySchema & {
  id: number;
};

export interface DesignPropertiesPanelProps {
  /**
   * Draft properties that have not yet been added to the design.
   */
  draftProperties: DraftDesignProperty[];

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
 * Renders the list of draft and persisted design property editors.
 */
export const DesignPropertiesPanel: React.FC<DesignPropertiesPanelProps> = ({
  draftProperties,
  onSaveDraft,
  onCancelDraft,
}) => {
  const properties = useDesignStudioStore(
    (state) => state.design?.properties || [],
  );

  // Property names used as sortable item IDs
  const propertyIds = useMemo(
    () => properties.map((property) => property.name),
    [properties],
  );

  // Build a lookup map for persisted properties by name
  const propertyMap = useMemo(() => {
    const map = new Map<string, PropertySchema>();

    for (const property of properties) {
      map.set(property.name, property);
    }

    return map;
  }, [properties]);

  // Persist the new property order to the design
  const handleSort = useCallback(
    (newOrder: string[]) => {
      const reorderedProperties = newOrder
        .map((name) => propertyMap.get(name))
        .filter((property): property is PropertySchema => !!property);

      updateDesignProperties(reorderedProperties);
    },
    [propertyMap],
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
          <DesignPropertyEditor
            property={property}
            dragHandleProps={sortableProps.handleProps}
          />
        </div>
      );
    },
    [propertyMap],
  );

  return (
    <ScrollArea>
      <div className="design-properties-panel">
        {properties.length === 0 && draftProperties.length === 0 && (
          <Text
            block
            size="sm"
            color="subtle"
            className="design-properties-panel-empty"
            text="designs.properties.empty"
          />
        )}
        {/* Persisted properties oldest first, sortable */}
        <SortableList
          items={propertyIds}
          direction="vertical"
          gap={0}
          onSort={handleSort}
          renderItem={renderItem}
        />
        {/* Draft properties appear at the bottom */}
        {draftProperties.map((property) => (
          <DesignPropertyEditor
            isDraft
            key={property.id}
            property={property}
            onSaveDraft={() => onSaveDraft(property.id)}
            onCancelDraft={() => onCancelDraft(property.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
