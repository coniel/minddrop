import { useCallback, useMemo } from 'react';
import { PropertySchema } from '@minddrop/properties';
import {
  SortableItemRenderProps,
  SortableList,
} from '@minddrop/ui-drag-and-drop';
import { ScrollArea, Text } from '@minddrop/ui-primitives';
import { DesignPropertyEditor } from '../DesignPropertyEditor';
import { useDesignStudio, useDesignStudioStore } from '../DesignStudioStore';
import './DesignPropertiesPanel.css';

export type DraftDesignProperty = PropertySchema & {
  /**
   * Identifies the draft while it has no persisted name yet.
   */
  id: number;
};

export interface DesignPropertiesPanelProps {
  /**
   * Draft properties not yet added to the design.
   */
  draftProperties: DraftDesignProperty[];

  /**
   * Callback fired with the draft's ID when it is saved.
   */
  onSaveDraft: (id: number) => void;

  /**
   * Callback fired with the draft's ID when it is cancelled.
   */
  onCancelDraft: (id: number) => void;
}

/**
 * Renders the property editors of the database design open in the
 * studio, followed by any properties still being drafted.
 */
export const DesignPropertiesPanel: React.FC<DesignPropertiesPanelProps> = ({
  draftProperties,
  onSaveDraft,
  onCancelDraft,
}) => {
  const studio = useDesignStudio();
  const properties = useDesignStudioStore((state) => {
    // Only database designs carry a property schema
    if (state.design?.type !== 'database') {
      return [];
    }

    return state.design.properties;
  });

  // Property names double as the sortable item IDs
  const propertyIds = useMemo(
    () => properties.map((property) => property.name),
    [properties],
  );

  // Index the properties so the sortable list can resolve an ID
  // back to its schema
  const propertyMap = useMemo(() => {
    const map = new Map<string, PropertySchema>();

    properties.forEach((property) => {
      map.set(property.name, property);
    });

    return map;
  }, [properties]);

  // Persist the reordered schema
  const handleSort = useCallback(
    (newOrder: string[]) => {
      const reordered = newOrder
        .map((name) => propertyMap.get(name))
        .filter((property): property is PropertySchema => !!property);

      studio.updateDesignProperties(reordered);
    },
    [propertyMap, studio],
  );

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
      <div className="designs-properties-panel">
        {properties.length === 0 && draftProperties.length === 0 && (
          <Text
            block
            size="sm"
            color="subtle"
            className="designs-properties-panel-empty"
            text="designs.properties.empty"
          />
        )}

        {/** Persisted properties, in their authored order **/}
        <SortableList
          items={propertyIds}
          direction="vertical"
          gap={0}
          onSort={handleSort}
          renderItem={renderItem}
        />

        {/** Drafts sit below, open for editing **/}
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
