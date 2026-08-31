import { useEffect, useState } from 'react';
import { DefaultTagIcon, TagGroup, TagGroups, Tags } from '@minddrop/tags';
import { Icons } from '@minddrop/ui-icons';
import {
  Button,
  ColorSelect,
  ContentIcon,
  Group,
  IconButton,
  IconPicker,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  SelectField,
  Stack,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';
import { ContentColor } from '@minddrop/ui-theme';
import { Views } from '@minddrop/views';

// Select value representing no group assignment
const NoGroupValue = 'none';

export interface NewTagPopoverProps {
  /**
   * Whether the popover is open.
   */
  open: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The element the popover is anchored to.
   */
  anchor?: PopoverPositionerProps['anchor'];

  /**
   * The group the new tag is assigned to by default.
   */
  defaultGroup?: TagGroup;
}

/**
 * Renders an anchored popover containing the new tag form: icon,
 * name, color and group fields, staged locally and persisted on
 * submit. The created tag is shown in the view.
 */
export const NewTagPopover: React.FC<NewTagPopoverProps> = ({
  open,
  onOpenChange,
  anchor,
  defaultGroup,
}) => {
  const [name, setName] = useState('');
  const [nameTaken, setNameTaken] = useState(false);
  const [icon, setIcon] = useState(DefaultTagIcon);
  const [color, setColor] = useState<ContentColor>('blue');
  const [groupId, setGroupId] = useState<string>(NoGroupValue);
  const setSubview = Views.useSetSubview();
  const groups = TagGroups.useAll();

  // Reset the staged fields for the next tag when opened
  useEffect(() => {
    if (open) {
      const nextColor = Tags.resolveNextColor();

      setName('');
      setNameTaken(false);
      setIcon(Icons.applyColor(DefaultTagIcon, nextColor));
      setColor(nextColor);
      setGroupId(defaultGroup?.id ?? NoGroupValue);
    }
  }, [open, defaultGroup]);

  // Clear the duplicate error while editing
  function handleNameChange(value: string) {
    setName(value);
    setNameTaken(false);
  }

  // Stage the picked icon, syncing the color to the icon's
  function handleSelectIcon(pickedIcon: string) {
    setIcon(pickedIcon);

    const iconColor = Icons.resolveColor(pickedIcon);

    if (iconColor) {
      setColor(iconColor);
    }
  }

  // Restore the default icon in the staged color
  function handleClearIcon() {
    setIcon(Icons.applyColor(DefaultTagIcon, color));
  }

  // Stage the picked color, recoloring the staged icon
  function handleColorChange(pickedColor: ContentColor) {
    setColor(pickedColor);
    setIcon(Icons.applyColor(icon, pickedColor));
  }

  // Create the tag from the staged fields and show it
  async function handleCreate() {
    const trimmedName = name.trim();

    // Blank names are not committed
    if (!trimmedName) {
      return;
    }

    // The staged group, dropped if it no longer exists
    const group = groups.find((candidate) => candidate.id === groupId);

    try {
      const tag = await Tags.create(trimmedName, color, group?.id);

      // Persist the staged icon when customized
      if (icon !== DefaultTagIcon) {
        await Tags.update(tag.id, { icon });
      }

      onOpenChange(false);
      setSubview({ id: tag.id });
    } catch {
      // The name is already in use, show the error and keep the
      // form open for editing
      setNameTaken(true);
    }
  }

  // Create the tag on Enter
  function handleNameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleCreate();
    }
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverPortal>
        <PopoverPositioner side="bottom" align="start" anchor={anchor}>
          <PopoverContent className="tag-form-popover">
            <Stack gap={2}>
              {/* The tag's icon and name */}
              <Group gap={2}>
                <IconPicker
                  closeOnSelect
                  currentIcon={icon}
                  onSelect={handleSelectIcon}
                  onClear={handleClearIcon}
                >
                  <IconButton
                    size="md"
                    variant="subtle"
                    color="neutral"
                    label="tags.details.icon"
                  >
                    <ContentIcon icon={icon} />
                  </IconButton>
                </IconPicker>
                <TextInput
                  autoFocus
                  unassisted
                  size="md"
                  variant="subtle"
                  className="tag-form-popover-name"
                  placeholder="tags.details.namePlaceholder"
                  value={name}
                  onValueChange={handleNameChange}
                  onKeyDown={handleNameKeyDown}
                />
              </Group>

              {/* Duplicate name error */}
              {nameTaken && (
                <Text
                  block
                  size="sm"
                  color="danger"
                  text="tags.form.nameTaken"
                />
              )}

              {/* The tag's color */}
              <ColorSelect
                variant="subtle"
                size="md"
                value={color}
                onValueChange={handleColorChange}
              />

              {/* The tag's group assignment */}
              <SelectField
                variant="subtle"
                size="md"
                value={groupId}
                options={[
                  { value: NoGroupValue, label: 'tags.details.groupNone' },
                  ...groups.map((group) => ({
                    value: group.id,
                    stringLabel: group.name,
                  })),
                ]}
                onValueChange={(value) => setGroupId(String(value))}
              />

              {/* Creates the tag */}
              <Group justify="end">
                <Button
                  size="sm"
                  variant="filled"
                  color="primary"
                  label="tags.form.create"
                  onClick={handleCreate}
                />
              </Group>
            </Stack>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};
