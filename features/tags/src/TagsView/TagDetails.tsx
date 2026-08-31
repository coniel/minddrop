import { useEffect, useRef, useState } from 'react';
import { DatabaseEntries } from '@minddrop/databases';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { useTranslation } from '@minddrop/i18n';
import { DefaultTagIcon, Tag, TagGroups, Tags } from '@minddrop/tags';
import {
  Button,
  ColorSelect,
  ContentIcon,
  Group,
  IconButton,
  IconPicker,
  SelectField,
  Stack,
  TextInput,
} from '@minddrop/ui-primitives';
import { ContentColor } from '@minddrop/ui-theme';
import { TagEntries } from './TagEntries';

// Select value representing no group assignment
const NoGroupValue = 'none';

export interface TagDetailsProps {
  /**
   * The tag to render the details of.
   */
  tag: Tag;

  /**
   * Whether the tag was just created and is still to be named:
   * the name field starts empty and focused.
   */
  draft?: boolean;

  /**
   * Callback fired when the name field is committed.
   */
  onNameCommit?: () => void;
}

/**
 * Renders a tag's details in two columns: its icon, name, color
 * and group fields on the left, the entries tagged with it on the
 * right.
 */
export const TagDetails: React.FC<TagDetailsProps> = ({
  tag,
  draft,
  onNameCommit,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(draft ? '' : tag.name);
  const { t } = useTranslation();
  const groups = TagGroups.useAll();

  // Resync the name field when a different tag is shown, or when
  // the name is changed elsewhere. Drafts start empty, to be named
  useEffect(() => {
    setName(draft ? '' : tag.name);
  }, [tag.id, tag.name, draft]);

  // Focus the name field for naming when a draft is shown
  useEffect(() => {
    if (draft) {
      nameInputRef.current?.focus();
    }
  }, [tag.id, draft]);

  // Persist the edited name, reverting to the current name when
  // blank or already in use
  async function handleCommitName() {
    const editedName = name.trim();

    // Naming is over either way
    onNameCommit?.();

    // The name is blank or unchanged, restore the current one
    if (!editedName || editedName === tag.name) {
      setName(tag.name);

      return;
    }

    try {
      await Tags.update(tag.id, { name: editedName });
    } catch {
      // The name is already in use, restore the current one
      setName(tag.name);
    }
  }

  // Commit the name on Enter by blurring the field
  function handleNameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  }

  // Persist the selected color
  function handleColorChange(color: ContentColor) {
    Tags.update(tag.id, { color });
  }

  // Persist the picked icon
  function handleSelectIcon(icon: string) {
    Tags.update(tag.id, { icon });
  }

  // Restore the default icon
  function handleClearIcon() {
    Tags.update(tag.id, { icon: DefaultTagIcon });
  }

  // Confirm before deleting the tag, noting how many entries
  // reference it
  function handleDelete() {
    const count = DatabaseEntries.getTagged(tag.name).length;

    // Pick the plural form matching the count
    const messageKey =
      count === 1
        ? 'tags.actions.delete.confirmation.message_one'
        : 'tags.actions.delete.confirmation.message_other';

    Events.dispatch(OpenConfirmationDialogEvent, {
      title: 'tags.actions.delete.confirmation.title',
      message: <>{t(messageKey, { count })}</>,
      confirmLabel: 'tags.actions.delete.confirmation.confirm',
      onConfirm: () => Tags.delete(tag.id),
    });
  }

  // Persist the selected group, clearing it on the none option
  function handleGroupChange(groupId: string | number) {
    // Clear the group on the none option
    if (groupId === NoGroupValue) {
      Tags.update(tag.id, { group: null });

      return;
    }

    // Look the group up to narrow the select value to a group ID
    const group = groups.find((candidate) => candidate.id === groupId);

    if (group) {
      Tags.update(tag.id, { group: group.id });
    }
  }

  return (
    <Group align="stretch" className="tag-details">
      {/* The tag's fields */}
      <Stack gap={4} className="tag-details-fields">
        {/* The tag's icon and name */}
        <Group gap={2}>
          <IconPicker
            closeOnSelect
            currentIcon={tag.icon}
            onSelect={handleSelectIcon}
            onClear={handleClearIcon}
          >
            <IconButton
              size="md"
              variant="subtle"
              color="neutral"
              label="tags.details.icon"
            >
              <ContentIcon icon={tag.icon} />
            </IconButton>
          </IconPicker>
          <TextInput
            ref={nameInputRef}
            variant="subtle"
            size="md"
            className="tag-details-name"
            placeholder="tags.details.namePlaceholder"
            value={name}
            onValueChange={setName}
            onBlur={handleCommitName}
            onKeyDown={handleNameKeyDown}
          />
        </Group>

        {/* The tag's color */}
        <ColorSelect
          variant="subtle"
          value={tag.color}
          onValueChange={handleColorChange}
        />

        {/* The tag's group assignment */}
        <SelectField
          variant="subtle"
          size="md"
          value={tag.group ?? NoGroupValue}
          options={[
            { value: NoGroupValue, label: 'tags.details.groupNone' },
            ...groups.map((group) => ({
              value: group.id,
              stringLabel: group.name,
            })),
          ]}
          onValueChange={handleGroupChange}
        />

        {/* Deletes the tag */}
        <Button
          variant="subtle"
          danger="on-hover"
          size="md"
          startIcon="trash-2"
          className="tag-details-delete"
          label="tags.actions.delete.label"
          onClick={handleDelete}
        />
      </Stack>

      {/* The entries tagged with the tag */}
      <TagEntries tag={tag} />
    </Group>
  );
};
