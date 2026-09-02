import { useState } from 'react';
import { Events } from '@minddrop/events';
import { PropertySchema, TagsPropertySchema } from '@minddrop/properties';
import { OpenTagsViewEvent, TagGroups } from '@minddrop/tags';
import { Button, Group, SelectField, Stack } from '@minddrop/ui-primitives';
import {
  PropertyEditorBase,
  PropertyEditorBaseProps,
} from '../PropertyEditorBase';

// Select value representing no group limit
const AllTagsValue = 'all';

export interface TagsPropertyEditorProps
  extends Omit<PropertyEditorBaseProps, 'property' | 'children'> {
  property: TagsPropertySchema;
}

/**
 * Renders the tags property editor: the base fields plus a tag
 * group limit select and a link to the tags management view.
 */
export const TagsPropertyEditor: React.FC<TagsPropertyEditorProps> = ({
  property,
  onSave,
  onCancel,
  ...other
}) => {
  const groups = TagGroups.useAll();
  // The staged group limit, 'all' when every tag is selectable
  const [groupId, setGroupId] = useState(property.group ?? AllTagsValue);

  // Persist the property with the staged group limit
  async function handleSave(savedProperty: PropertySchema) {
    const saved = { ...(savedProperty as TagsPropertySchema) };

    // Drop the limit when all tags are selectable
    if (groupId === AllTagsValue) {
      delete saved.group;
    } else {
      saved.group = groupId;
    }

    return onSave(saved);
  }

  // Reset the staged group limit
  function handleCancel() {
    setGroupId(property.group ?? AllTagsValue);

    if (onCancel) {
      onCancel();
    }
  }

  // Open the tags management view in a new tab
  function handleManageTags() {
    Events.dispatch(OpenTagsViewEvent, { openMode: 'new-tab' });
  }

  return (
    <PropertyEditorBase
      property={property}
      onSave={handleSave}
      onCancel={handleCancel}
      {...other}
    >
      <Stack gap={2}>
        {/* The tag group the selection is limited to */}
        <SelectField
          variant="subtle"
          size="md"
          label="properties.tags.group.label"
          value={groupId}
          options={[
            { value: AllTagsValue, label: 'properties.tags.group.all' },
            ...groups.map((group) => ({
              value: group.id,
              stringLabel: group.name,
            })),
          ]}
          onValueChange={(value) => setGroupId(String(value))}
        />

        {/* Opens the global tags management view */}
        <Group justify="end">
          <Button
            size="sm"
            variant="ghost"
            label="properties.tags.manage"
            onClick={handleManageTags}
          />
        </Group>
      </Stack>
    </PropertyEditorBase>
  );
};
